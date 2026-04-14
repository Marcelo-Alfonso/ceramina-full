import uuid
from sqlalchemy import Column, String, Integer, Text, ForeignKey, CheckConstraint, BigInteger, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    role = Column(Text, default="user")
    created_at = Column(DateTime, server_default=func.now())


class Product(Base):
    __tablename__ = "products"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(Text, nullable=False)
    price = Column(Integer, nullable=False)
    image = Column(Text)
    description = Column(Text)
    slug = Column(Text, nullable=False, unique=True)
    created_at = Column(DateTime, server_default=func.now())

    order_items = relationship("OrderItem", back_populates="product")


class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    email = Column(Text, nullable=False)
    address = Column(Text, nullable=True)
    phone = Column(Text, nullable=False)
    shipping_method = Column(Text, nullable=False)
    shipping_cost = Column(Integer, nullable=False, default=0)
    amount = Column(Integer, nullable=False)
    status = Column(Text, nullable=False, default="pending")
    flow_token = Column(Text)
    flow_order = Column(BigInteger)
    idempotency_key = Column(Text, unique=True)
    created_at = Column(DateTime, server_default=func.now())
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint("amount > 0", name="orders_amount_check"),

        CheckConstraint(
            "status IN ('pending', 'paid', 'rejected')",
            name="orders_status_check",
        ),

        CheckConstraint(
            "shipping_method IN ('pickup', 'standard')",
            name="orders_shipping_method_check",
        ),

        CheckConstraint(
            "shipping_cost >= 0",
            name="orders_shipping_cost_check",
        ),
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)

    order_id = Column(UUID(as_uuid=True), ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    product_id = Column(BigInteger, ForeignKey("products.id"), nullable=False)

    quantity = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")

    __table_args__ = (
        CheckConstraint("quantity > 0", name="order_items_quantity_check"),
        CheckConstraint("price > 0", name="order_items_price_check"),
    )