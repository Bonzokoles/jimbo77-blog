import xml.etree.ElementTree as ET
import re
from pathlib import Path

def extract_products_from_xml(xml_file):
    """Extract product ID and URL from XML feed"""
    products = []
    
    print(f"📖 Reading {xml_file.name}...")
    
    try:
        # Read XML file
        with open(xml_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract using regex (faster for large files)
        # Pattern: <product id="123"> ... <url>http://...</url>
        product_pattern = r'<product[^>]*id="([^"]+)"[^>]*>.*?<url>([^<]+)</url>'
        matches = re.findall(product_pattern, content, re.DOTALL)
        
        for product_id, url in matches:
            # Clean URL (remove feed parameters if present)
            clean_url = url.split('.feed')[0] if '.feed' in url else url
            products.append((product_id, clean_url))
        
        print(f"  ✅ Found {len(matches)} products")
        
    except Exception as e:
        print(f"  ❌ Error: {e}")
    
    return products

def convert_to_txt(input_dir, output_file):
    """Convert all XML feeds to simple TXT format"""
    
    input_path = Path(input_dir)
    all_products = []
    
    # Process all feed_part_*.xml files
    xml_files = sorted(input_path.glob('feed_part_*.xml'))
    
    if not xml_files:
        print("❌ No feed_part_*.xml files found!")
        return
    
    print(f"🔄 Processing {len(xml_files)} XML files...\n")
    
    for xml_file in xml_files:
        products = extract_products_from_xml(xml_file)
        all_products.extend(products)
    
    # Write to TXT file (ID|URL format)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# Product ID to URL Mapping\n")
        f.write(f"# Total products: {len(all_products)}\n")
        f.write(f"# Format: PRODUCT_ID|URL\n\n")
        
        for product_id, url in all_products:
            f.write(f"{product_id}|{url}\n")
    
    print(f"\n✅ Converted {len(all_products)} products")
    print(f"📄 Output: {output_file}")
    print(f"\n📋 Sample lines:")
    for product_id, url in all_products[:5]:
        print(f"  {product_id}|{url}")

def convert_to_markdown(input_dir, output_file):
    """Convert to Markdown table format"""
    
    input_path = Path(input_dir)
    all_products = []
    
    xml_files = sorted(input_path.glob('feed_part_*.xml'))
    
    print(f"🔄 Processing {len(xml_files)} XML files...\n")
    
    for xml_file in xml_files:
        products = extract_products_from_xml(xml_file)
        all_products.extend(products)
    
    # Write Markdown table
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(f"# Product URLs from MeblePumo Feed\n\n")
        f.write(f"Total products: **{len(all_products)}**\n\n")
        f.write(f"| Product ID | URL |\n")
        f.write(f"|------------|-----|\n")
        
        for product_id, url in all_products:
            f.write(f"| {product_id} | {url} |\n")
    
    print(f"\n✅ Converted {len(all_products)} products to Markdown")
    print(f"📄 Output: {output_file}")

if __name__ == "__main__":
    # Directories
    INPUT_DIR = r"U:\JIMBO_UNIFIED_CONTROL_hub\LIBRARIES\CONTROL_CENTER\MEBLEPUMO_INTEL\PUMO_AI_FRENDLY_operacja_WHITECAT"
    OUTPUT_TXT = r"U:\JIMBO_UNIFIELD_FATPROJECTS_hub\M_PUMO_PROJEKT\CAY_FEED_conventer\products_id_url.txt"
    OUTPUT_MD = r"U:\JIMBO_UNIFIELD_FATPROJECTS_hub\M_PUMO_PROJEKT\CAY_FEED_conventer\products_id_url.md"
    
    print("="*60)
    print("🔄 XML to TXT/Markdown Converter")
    print("="*60 + "\n")
    
    # Convert to TXT (best for LLM Notebook)
    print("📝 Creating TXT file...\n")
    convert_to_txt(INPUT_DIR, OUTPUT_TXT)
    
    print("\n" + "="*60 + "\n")
    
    # Convert to Markdown (more readable)
    print("📝 Creating Markdown file...\n")
    convert_to_markdown(INPUT_DIR, OUTPUT_MD)
    
    print("\n" + "="*60)
    print("✅ Conversion complete!")
    print("\n📌 Next steps:")
    print("1. Upload products_id_url.txt to LLM Notebook")
    print("2. Use Gemini prompt to generate SQL UPDATE statements")
    print("3. Execute SQL in D1 database")
    print("="*60)
