import json
from pathlib import Path

# Paths
INPUT_JSON = r"U:\JIMBO_UNIFIED_CONTROL_hub\LIBRARIES\CONTROL_CENTER\MEBLEPUMO_INTEL\PUMO_AI_FRENDLY_operacja_WHITECAT\products.json"
OUTPUT_SQL = r"U:\JIMBO_UNIFIELD_WEBSIDES_hub\my-bonzo-ai-blog\update-product-urls.sql"
OUTPUT_TXT = r"U:\JIMBO_UNIFIELD_FATPROJECTS_hub\M_PUMO_PROJEKT\CAY_FEED_conventer\products_id_url.txt"

print("="*60)
print("🔄 JSON to SQL Converter")
print("="*60 + "\n")

# Read JSON
print(f"📖 Reading products.json...")
with open(INPUT_JSON, 'r', encoding='utf-8') as f:
    products_dict = json.load(f)

print(f"✅ Loaded {len(products_dict)} products\n")

# Generate SQL file
print(f"📝 Generating SQL UPDATE statements...")
with open(OUTPUT_SQL, 'w', encoding='utf-8') as f:
    f.write(f"-- Update products with real URLs from products.json\n")
    f.write(f"-- Total products: {len(products_dict)}\n\n")
    
    for product_id, product_data in products_dict.items():
        # Use 'url' field (not tracked_url which has UTM)
        url = product_data.get('url', '')
        
        if url:
            # Clean URL (remove .feed suffix if present)
            clean_url = url.split('.feed')[0] if '.feed' in url else url
            f.write(f"UPDATE products SET real_url = '{clean_url}' WHERE id = '{product_id}';\n")

print(f"✅ Generated SQL file: {OUTPUT_SQL}")

# Also generate simple TXT for reference
print(f"\n📝 Generating TXT mapping...")
with open(OUTPUT_TXT, 'w', encoding='utf-8') as f:
    f.write(f"# Product ID to URL Mapping\n")
    f.write(f"# Total: {len(products_dict)} products\n")
    f.write(f"# Format: ID|URL\n\n")
    
    for product_id, product_data in products_dict.items():
        url = product_data.get('url', '')
        if url:
            clean_url = url.split('.feed')[0] if '.feed' in url else url
            f.write(f"{product_id}|{clean_url}\n")

print(f"✅ Generated TXT file: {OUTPUT_TXT}")

# Show sample
print(f"\n📋 Sample SQL statements:")
sample_items = list(products_dict.items())[:5]
for product_id, product_data in sample_items:
    url = product_data.get('url', '').split('.feed')[0]
    if url:
        print(f"  UPDATE products SET real_url = '{url}' WHERE id = '{product_id}';")

print(f"\n" + "="*60)
print("✅ Conversion complete!")
print(f"\n📌 Next step:")
print(f"  wrangler d1 execute jimbo-rag-db --file=update-product-urls.sql --remote")
print("="*60)
