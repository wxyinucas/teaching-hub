import sys

rows = 4
print("[trace] stage=entered", file=sys.stderr)
print(f"[trace] stage=ready rows={rows}", file=sys.stderr)
print(f"rows={rows}")
