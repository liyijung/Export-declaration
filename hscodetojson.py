import pandas as pd
import json
import os

# 讀取 Excel 檔案
file_path = r"C:\Users\Admin\Desktop\海關進口稅則資料2025.xls"
try:
    tax_data = pd.read_excel(file_path, dtype=str)
    print("Excel 資料成功讀取。")
except Exception as e:
    print(f"讀取 Excel 檔案時發生錯誤: {e}")
    exit()

# 顯示部分資料進行檢查
print(tax_data.head())

# 替換 NaN 值為空字串
tax_data = tax_data.apply(lambda col: col.map(lambda x: "" if pd.isna(x) else x))

# 將稅則數據轉換為 JSON 格式
try:
    tax_data_json = tax_data.to_dict(orient='records')
    print("JSON 數據已成功轉換。")
except Exception as e:
    print(f"數據轉換為 JSON 時發生錯誤: {e}")
    exit()

# 檢查或創建目錄
output_dir = 'C:/Users/Admin/Desktop'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# 寫入 JSON 檔案
output_file = os.path.join(output_dir, 'tax_data.json')
try:
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(tax_data_json, f, ensure_ascii=False, indent=4)
    print(f"JSON 檔案已成功生成於: {output_file}")
except Exception as e:
    print(f"寫入 JSON 檔案時發生錯誤: {e}")