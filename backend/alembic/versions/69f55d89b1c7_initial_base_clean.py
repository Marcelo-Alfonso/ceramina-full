"""Initial clean schema with order_items, RLS and triggers"""

from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = "initial_clean"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")

    #Tabla para usuarios
    op.create_table(
        "users",
        sa.Column("id", sa.UUID(), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("role", sa.Text(), nullable=True, server_default="user"),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    #Tabla para productos
    op.create_table(
        "products",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("name", sa.Text(), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.Column("image", sa.Text(), nullable=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("slug", sa.Text(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()")),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_unique_constraint("products_slug_key", "products", ["slug"])

    #Tabla para ordenes
    op.create_table(
        "orders",
        sa.Column("id", sa.UUID(), server_default=sa.text("gen_random_uuid()"), nullable=False),
        sa.Column("user_id", sa.UUID(), nullable=True),
        sa.Column("email", sa.Text(), nullable=False),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("phone", sa.Text(), nullable=False),
        sa.Column("shipping_method", sa.Text(), nullable=False),
        sa.Column("shipping_cost", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("amount", sa.Integer(), nullable=False),
        sa.Column("status", sa.Text(), nullable=False, server_default="pending"),
        sa.Column("flow_token", sa.Text(), nullable=True),
        sa.Column("flow_order", sa.BigInteger(), nullable=True),
        sa.Column("idempotency_key", sa.Text(), nullable=True),
        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()")),

        sa.CheckConstraint("amount > 0", name="orders_amount_check"),
        sa.CheckConstraint("status IN ('pending','paid','rejected')", name="orders_status_check"),
        sa.CheckConstraint(
            "shipping_method IN ('pickup','standard')",
            name="orders_shipping_method_check"
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_foreign_key("orders_user_id_fkey", "orders", "users", ["user_id"], ["id"])
    op.create_unique_constraint("orders_idempotency_key_key", "orders", ["idempotency_key"])
    op.create_index("ix_orders_email", "orders", ["email"])

    #Tabla para los productos de cada orden
    op.create_table(
        "order_items",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("order_id", sa.UUID(), nullable=False),
        sa.Column("product_id", sa.BigInteger(), nullable=False),
        sa.Column("quantity", sa.Integer(), nullable=False),
        sa.Column("price", sa.Integer(), nullable=False),
        sa.CheckConstraint("quantity > 0", name="order_items_quantity_check"),
        sa.CheckConstraint("price > 0", name="order_items_price_check"),
        sa.ForeignKeyConstraint(["order_id"], ["orders.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["product_id"], ["products.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "discounts",
        sa.Column("id", sa.Uuid(), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("product_id", sa.BigInteger(), sa.ForeignKey("products.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.Text(), nullable=False),

        sa.Column(
            "discount_type",
            sa.Text(),
            sa.CheckConstraint("discount_type IN ('percentage', 'fixed')"),
            nullable=False
        ),
        sa.Column("discount_value", sa.Integer(), nullable=False),

        sa.Column("starts_at", sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column("ends_at", sa.TIMESTAMP(timezone=True), nullable=False),

        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),

        sa.Column("created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("now()")),
    )

    # Constraint: fechas válidas
    op.create_check_constraint(
        "ck_discounts_valid_dates",
        "discounts",
        "ends_at > starts_at"
    )


    # Policy: lectura pública solo descuentos activos
    op.execute("""
        CREATE POLICY "Public can read active discounts"
        ON discounts
        FOR SELECT
        USING (
            is_active = true
            AND now() >= starts_at
            AND now() <= ends_at
        );
    """)
    



    #Habilitación de row level security
    op.execute("ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;")
    op.execute("ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;")


    #Creación de politicas de productos
    op.execute("""
    CREATE POLICY "Public read products"
    ON public.products
    FOR SELECT
    USING (true);
    """)

    op.execute("""
    CREATE POLICY "Admin manage products"
    ON public.products
    FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid()
            AND users.role = 'admin'
        )
    );
    """)

    #Creación de politicas de órdenes
    op.execute("""
    CREATE POLICY "Users can view own orders"
    ON public.orders
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR email = (auth.jwt() ->> 'email')
    );
    """)

    op.execute("""
    CREATE POLICY "Only backend can insert orders"
    ON public.orders
    FOR INSERT
    WITH CHECK (true);
    """)

    #Creación de políticas de usuarios
    op.execute("""
    CREATE POLICY "Users can read own profile"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);
    """)

    #Creación de triggers
    op.execute("""
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger AS $$
    BEGIN
        INSERT INTO public.users (id, role)
        VALUES (NEW.id, 'user');
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    """)

    op.execute("""
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
    """)

    #Creación de políticas de storage en supabase
    op.execute("""
    CREATE POLICY "Public read product images"
    ON storage.objects
    FOR SELECT
    TO public
    USING (
    bucket_id = 'product-images'
    );
    """)

    op.execute("""
    CREATE POLICY "Admin upload product images"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
    );
    """)

    op.execute("""
    CREATE POLICY "Admin update product images"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
    );
    """)

    op.execute("""
    CREATE POLICY "Admin delete product images"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
    bucket_id = 'product-images'
    AND EXISTS (
        SELECT 1 FROM public.users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
    );
    """)





def downgrade():
    op.execute("DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;")
    op.execute("DROP FUNCTION IF EXISTS public.handle_new_user;")

    op.drop_table("order_items")
    op.drop_table("orders")
    op.drop_table("products")
    op.drop_table("users")