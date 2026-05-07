import sqlite3

# Connect to database
conn = sqlite3.connect('backend/resume.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("=" * 50)
print("TABLES IN resume.db:")
print("=" * 50)
for table in tables:
    print(f"\n📋 Table: {table[0]}")
    
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
    count = cursor.fetchone()[0]
    print(f"   Rows: {count}")
    
    # Get column names
    cursor.execute(f"PRAGMA table_info({table[0]})")
    columns = cursor.fetchall()
    print(f"   Columns: {', '.join([col[1] for col in columns])}")
    
    # Show first 3 rows
    if count > 0:
        cursor.execute(f"SELECT * FROM {table[0]} LIMIT 3")
        rows = cursor.fetchall()
        print(f"\n   Sample Data:")
        for i, row in enumerate(rows, 1):
            print(f"   Row {i}: {row}")

conn.close()
print("\n" + "=" * 50)
