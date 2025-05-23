// taiwanAdminService.ts

// 移除 fs 和 path 引入
import taiwanDataRaw from "@/app/(manage)/enterprise/_enterprise/data/taiwanData.json";

/**
 * 台灣行政區劃數據結構的介面定義
 */
export interface District {
  zip: string;
  name: string;
}

export interface City {
  name: string;
  districts: District[];
}

export interface LocationInfo {
  city: string;
  district: string;
  zip: string;
}

export interface DistrictInfo {
  name: string;
  zip: string;
}

/**
 * 台灣行政區劃實用工具類
 *
 * 用於處理台灣的行政區劃（縣市、區鄉鎮）和郵遞區號
 */
export class TaiwanAdminDivisions {
  private data: City[];
  private zipToLocationMap: Map<string, LocationInfo>;
  private nameToLocationsMap: Map<string, LocationInfo[]>;

  /**
   * TaiwanAdminDivisions 構造函數
   * @param data 台灣行政區劃數據陣列
   */
  constructor(data: City[]) {
    this.data = data;
    this.zipToLocationMap = new Map<string, LocationInfo>();
    this.nameToLocationsMap = new Map<string, LocationInfo[]>();

    // 初始化查詢映射
    this.initializeMaps();
  }

  /**
   * 初始化查詢映射以加快訪問速度
   */
  private initializeMaps(): void {
    for (const city of this.data) {
      for (const district of city.districts) {
        // 郵遞區號映射
        const locationInfo: LocationInfo = {
          city: city.name,
          district: district.name,
          zip: district.zip,
        };

        this.zipToLocationMap.set(district.zip, locationInfo);

        // 區域名稱映射
        if (!this.nameToLocationsMap.has(district.name)) {
          this.nameToLocationsMap.set(district.name, []);
        }

        this.nameToLocationsMap.get(district.name)?.push(locationInfo);
      }
    }
  }

  /**
   * 獲取台灣所有縣市
   * @return 縣市名稱陣列
   */
  public getAllCities(): string[] {
    return this.data.map((city) => city.name);
  }

  /**
   * 獲取指定縣市的所有區鄉鎮
   * @param cityName 縣市名稱
   * @return 區鄉鎮物件陣列，包含名稱和郵遞區號
   */
  public getDistrictsByCity(cityName: string): DistrictInfo[] {
    const city = this.data.find((c) => c.name === cityName);
    if (!city) {
      return [];
    }

    return city.districts.map((d) => ({
      name: d.name,
      zip: d.zip,
    }));
  }

  /**
   * 通過郵遞區號查詢位置資訊
   * @param zipCode 要查詢的郵遞區號
   * @return 如果找到則返回位置資訊，否則返回 null
   */
  public findByZip(zipCode: string): LocationInfo | null {
    return this.zipToLocationMap.get(zipCode) || null;
  }

  /**
   * 通過區域名稱查詢位置（可能返回多個匹配項）
   * @param districtName 要查詢的區域名稱
   * @return 匹配該區域名稱的位置物件陣列
   */
  public findByDistrictName(districtName: string): LocationInfo[] {
    return this.nameToLocationsMap.get(districtName) || [];
  }

  /**
   * 搜尋名稱中包含特定字串的區域
   * @param searchText 區域名稱中要搜尋的文字
   * @return 匹配的區域資訊陣列
   */
  public searchDistricts(searchText: string): LocationInfo[] {
    const results: LocationInfo[] = [];

    for (const city of this.data) {
      for (const district of city.districts) {
        if (district.name.includes(searchText)) {
          results.push({
            city: city.name,
            district: district.name,
            zip: district.zip,
          });
        }
      }
    }

    return results;
  }

  /**
   * 獲取指定區域的格式化地址（含郵遞區號）
   * @param cityName 縣市名稱
   * @param districtName 區鄉鎮名稱
   * @return 如果找到則返回格式化地址，否則返回 null
   */
  public getFormattedAddress(
    cityName: string,
    districtName: string
  ): string | null {
    const city = this.data.find((c) => c.name === cityName);
    if (!city) {
      return null;
    }

    const district = city.districts.find((d) => d.name === districtName);
    if (!district) {
      return null;
    }

    return `${district.zip} ${cityName}${districtName}`;
  }
}

/**
 * 解析台灣行政區劃數據的實用函數
 * 主要用於處理非標準JSON格式
 * @param rawData 原始數據
 * @return 解析後的 City 陣列
 */
export function parseTaiwanAdminData(rawData: any): City[] {
  // 前端版本簡化為直接返回數據
  // 如果是字符串，嘗試解析
  if (typeof rawData === "string") {
    try {
      // 先嘗試修復格式為正確的 JSON
      const fixedJson = rawData
        .replace(/(\w+):/g, '"$1":') // 在屬性名稱周圍添加引號
        .replace(/,(\s*[}\]])/g, "$1"); // 移除尾部逗號

      return JSON.parse(fixedJson);
    } catch (e) {
      console.error("解析台灣行政區劃數據失敗:", e);
      return [];
    }
  }

  // 如果已經是物件陣列，直接返回
  return rawData;
}

// 創建並導出預設的台灣行政區劃實用工具實例
let defaultInstance: TaiwanAdminDivisions | null = null;

/**
 * 獲取台灣行政區劃實用工具的單例實例
 * @return TaiwanAdminDivisions 實例
 */
export function getTaiwanAdminUtil(): TaiwanAdminDivisions {
  if (!defaultInstance) {
    try {
      // 使用直接導入的數據
      defaultInstance = new TaiwanAdminDivisions(
        parseTaiwanAdminData(taiwanDataRaw)
      );
    } catch (error) {
      console.error("初始化台灣行政區劃實用工具失敗:", error);
      // 在前端環境中，返回有限功能的實例而不是拋出異常
      defaultInstance = new TaiwanAdminDivisions([]);
    }
  }
  return defaultInstance;
}

// 為了方便使用，直接導出預設實例的方法
export const getAllCities = () => getTaiwanAdminUtil().getAllCities();
export const getDistrictsByCity = (cityName: string) =>
  getTaiwanAdminUtil().getDistrictsByCity(cityName);
export const findByZip = (zipCode: string) =>
  getTaiwanAdminUtil().findByZip(zipCode);
export const findByDistrictName = (districtName: string) =>
  getTaiwanAdminUtil().findByDistrictName(districtName);
export const searchDistricts = (searchText: string) =>
  getTaiwanAdminUtil().searchDistricts(searchText);
export const getFormattedAddress = (cityName: string, districtName: string) =>
  getTaiwanAdminUtil().getFormattedAddress(cityName, districtName);
