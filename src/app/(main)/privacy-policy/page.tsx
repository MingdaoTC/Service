import { Metadata } from "next";

export const metadata: Metadata = {
  title: "隱私政策 - 明道校友就業服務平台",
  description:
    "明道校友就業服務平台隱私政策，詳細說明我們如何收集、使用和保護您的個人資料，確保校友隱私權益。",
  robots: "index, follow",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">隱私政策</h1>
            <p className="text-gray-600">明道人才雲</p>
            <p className="text-sm text-gray-500 mt-2">
              最後更新日期：2025年05月29日
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              明道人才雲（以下簡稱「本平台」）重視您的隱私權，本隱私政策說明我們如何收集、使用、處理及保護您的個人資料。
              使用本平台服務即表示您同意本隱私政策的內容。
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                適用範圍
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  本隱私政策適用於明道校友就業服務平台所提供的所有服務，包括但不限於：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>求職者註冊、履歷建立及求職服務</li>
                  <li>企業註冊、職缺刊登及招募服務</li>
                  <li>校友身份驗證及社群功能</li>
                  <li>職涯諮詢及相關加值服務</li>
                  <li>網站瀏覽及使用者體驗優化</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                個人資料的收集
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.1 校友註冊資料
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>
                      基本資料：姓名、性別、出生年月日、聯絡電話、電子郵件
                    </li>
                    <li>
                      學歷資料：就讀科系、入學年份、畢業年份、學號（用於校友身份驗證）
                    </li>
                    <li>職涯資料：工作經歷、專業技能、求職偏好</li>
                    <li>身份驗證：畢業證書或相關證明文件</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.2 企業註冊資料
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>公司基本資料：公司名稱、統一編號、地址、聯絡方式</li>
                    <li>負責人資料：姓名、職稱、聯絡方式</li>
                    <li>校友關聯：校友身份證明（如適用）</li>
                    <li>營業登記及相關證明文件</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.3 使用行為資料
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>登入記錄、瀏覽頁面、搜尋關鍵字</li>
                    <li>求職應徵記錄、職缺瀏覽歷史</li>
                    <li>平台互動行為（按讚、分享、留言等）</li>
                    <li>裝置資訊、IP 位址、瀏覽器類型</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                個人資料的使用目的
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  我們收集您的個人資料僅用於以下目的：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>身份驗證</strong>
                    ：確認明道校友身份，維護平台社群品質
                  </li>
                  <li>
                    <strong>服務提供</strong>
                    ：提供求職媒合、履歷建置、職缺推薦等核心服務
                  </li>
                  <li>
                    <strong>客戶服務</strong>：回應諮詢、處理申訴、提供技術支援
                  </li>
                  <li>
                    <strong>服務改善</strong>
                    ：分析使用行為，優化平台功能及使用者體驗
                  </li>
                  <li>
                    <strong>行銷推廣</strong>
                    ：發送服務通知、職缺資訊、活動邀請（需經您同意）
                  </li>
                  <li>
                    <strong>法規遵循</strong>：配合政府機關依法調查或處理爭議
                  </li>
                  <li>
                    <strong>統計分析</strong>
                    ：進行匿名化統計分析，不會識別特定個人
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                個人資料的分享與揭露
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-gray-700">
                  除下列情況外，我們不會將您的個人資料提供給第三方：
                </p>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.1 經您同意的分享
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>求職者主動投遞履歷給企業時</li>
                    <li>參與校友活動或職涯諮詢服務時</li>
                    <li>使用第三方服務（如社群登入）時</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.2 法律要求的揭露
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>配合司法機關、檢調單位依法進行之調查</li>
                    <li>配合相關主管機關依法進行之調查或處分</li>
                    <li>為保護本平台、使用者或第三人之權益</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.3 服務夥伴
                  </h3>
                  <p className="text-gray-700 ml-4">
                    我們可能與技術服務提供商（如雲端服務、分析工具）分享必要資料，
                    但僅限於提供服務所需，且所有夥伴均需遵守嚴格的保密協議。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                資料安全保護
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  我們採取多項技術及管理措施來保護您的個人資料：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>技術保護</strong>：SSL
                    加密傳輸、防火牆、入侵偵測系統
                  </li>
                  <li>
                    <strong>存取控制</strong>：員工分級授權、最小權限原則
                  </li>
                  <li>
                    <strong>資料備份</strong>：定期備份，確保資料完整性
                  </li>
                  <li>
                    <strong>監控審計</strong>：系統監控、存取記錄、定期安全檢測
                  </li>
                  <li>
                    <strong>員工訓練</strong>：定期進行資安及隱私保護教育訓練
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                您的權利
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  根據個人資料保護法，您擁有以下權利：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>查詢權</strong>：查詢或請求閱覽您的個人資料
                  </li>
                  <li>
                    <strong>更正權</strong>：請求補充或更正您的個人資料
                  </li>
                  <li>
                    <strong>刪除權</strong>
                    ：請求停止收集、處理或利用您的個人資料
                  </li>
                  <li>
                    <strong>撤回同意</strong>：隨時撤回您對資料處理的同意
                  </li>
                  <li>
                    <strong>資料可攜權</strong>
                    ：請求以電子檔案格式提供您的個人資料
                  </li>
                </ul>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <p className="text-yellow-800">
                    <strong>注意</strong>
                    ：行使上述權利可能影響您使用本平台服務的功能。
                    如需行使相關權利，請聯絡我們的客服團隊。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                Cookie 使用政策
              </h2>
              <div className="ml-11 space-y-4">
                <p className="text-gray-700">
                  本平台使用 Cookie 及類似技術來改善您的使用體驗：
                </p>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.1 必要性 Cookie
                  </h3>
                  <p className="text-gray-700 ml-4">
                    維持登入狀態、購物車功能、安全驗證等基本服務運作。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.2 功能性 Cookie
                  </h3>
                  <p className="text-gray-700 ml-4">
                    記住您的偏好設定、語言選擇等個人化功能。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.3 分析性 Cookie
                  </h3>
                  <p className="text-gray-700 ml-4">
                    了解網站使用情況，改善服務品質（如 Google Analytics）。
                  </p>
                </div>

                <p className="text-gray-700">
                  您可以透過瀏覽器設定管理 Cookie，但停用某些 Cookie
                  可能影響網站功能。
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                資料保存期限
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  我們將根據以下原則保存您的個人資料：
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    <strong>帳戶資料</strong>：帳戶存續期間及刪除後 3 年
                  </li>
                  <li>
                    <strong>求職記錄</strong>：最後活動後 5 年
                  </li>
                  <li>
                    <strong>交易記錄</strong>：依法令規定保存 5 年
                  </li>
                  <li>
                    <strong>客服記錄</strong>：問題解決後 2 年
                  </li>
                  <li>
                    <strong>行銷資料</strong>：撤回同意後立即停止使用並於 30
                    天內刪除
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  9
                </span>
                政策更新
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  我們可能因應法規變更、服務調整或營運需求而修訂本隱私政策。
                  重大變更將於生效前 30 天在平台上公告，並透過電子郵件通知您。
                  繼續使用本平台服務即表示您同意修訂後的隱私政策。
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  10
                </span>
                聯絡我們
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  如對本隱私政策有任何疑問或需要協助，請透過以下方式聯絡我們：
                </p>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p className="text-gray-700">
                    <strong>客服信箱</strong>：alumni@ms.mingdao.edu.tw{" "}
                  </p>
                  <p className="text-gray-700">
                    <strong>客服電話</strong>：04-2334-1340
                  </p>
                  <p className="text-gray-700">
                    <strong>傳真電話</strong>：04-2337-2101
                  </p>
                  <p className="text-gray-700">
                    <strong>通訊地址</strong>：41401台中市烏日區中山路一段497號
                    (明道樓5樓校友會館)
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
