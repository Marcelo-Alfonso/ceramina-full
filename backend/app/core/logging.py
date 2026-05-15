def mask_secret(value: str, visible_prefix: int = 4, visible_suffix: int = 4) -> str:
    if not value or len(value) <= visible_prefix + visible_suffix:
        return "***"
    return f"{value[:visible_prefix]}...{value[-visible_suffix:]}"


def mask_email(email: str) -> str:
    if not email or "@" not in email:
        return "***"
    local, domain = email.split("@", 1)
    if len(local) <= 2:
        local_masked = local[0] + "..."
    else:
        local_masked = f"{local[:2]}..."
    return f"{local_masked}@{domain}"
