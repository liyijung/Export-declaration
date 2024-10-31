import pandas as pd
import json

# 讀取 Excel 檔案
file_path = r"C:\Users\Admin\Desktop\海關進口稅則資料2024.xls"
tax_data = pd.read_excel(file_path, dtype=str)

# 顯示全部資料
print(tax_data)

# 將 NaN 值替換為 ""
tax_data = tax_data.applymap(lambda x: "" if pd.isna(x) else x)

# 將稅則數據轉換為 JSON 格式
tax_data_json = tax_data.to_dict(orient='records')

# 將 JSON 資料寫入文件，方便在 JavaScript 中使用
with open('C:/Users/Admin/Desktop/tax_data.json', 'w', encoding='utf-8') as f:
    json.dump(tax_data_json, f, ensure_ascii=False, indent=4)
