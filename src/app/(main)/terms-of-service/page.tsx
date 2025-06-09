export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">服務條款</h1>
            <p className="text-gray-600">明道人才雲使用條款</p>
            <p className="text-sm text-gray-500 mt-2">
              最後更新日期：2025年05月29日
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">
              歡迎使用明道校友就業服務平台！請仔細閱讀以下服務條款。
              當您註冊並使用本平台服務時，即表示您已閱讀、瞭解並同意接受本服務條款之所有內容。
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-8 space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  1
                </span>
                服務定義與範圍
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    1.1 服務平台
                  </h3>
                  <p className="text-gray-700">
                    明道人才雲（以下簡稱「本平台」）是由明道中學營運的線上就業媒合服務，
                    專為明道中學校友及校友企業提供職涯發展與人才招募服務。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    1.2 服務內容
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>
                      <strong>求職服務</strong>：履歷建置、職缺搜尋、應徵投遞
                    </li>
                    <li>
                      <strong>招募服務</strong>
                      ：企業註冊、職缺刊登、履歷篩選、候選人管理
                    </li>
                    {/* <li><strong>校友服務</strong>：身份驗證、校友網絡、職涯諮詢、活動資訊</li>
                    <li><strong>加值服務</strong>：履歷健診、職涯規劃、企業專案合作</li>
                    <li><strong>資訊服務</strong>：產業趨勢、薪資調查、就業市場分析</li> */}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    1.3 使用資格
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>明道中學校友</li>
                    <li>校友所創辦或經營之企業</li>
                    <li>與明道中學有合作關係之企業</li>
                    <li>經本平台審核認可之其他企業</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  2
                </span>
                帳戶註冊與管理
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.1 註冊要求
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>提供真實、準確、完整的個人或企業資訊</li>
                    <li>校友須通過校友身份驗證</li>
                    <li>企業須提供營業登記證及相關證明文件</li>
                    <li>同意遵守本服務條款及隱私政策</li>
                    <li>年滿 18 歲或具有完全行為能力</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.2 帳戶責任
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>不得與他人共用平台登入帳戶</li>
                    <li>立即通知任何未經授權的帳戶使用</li>
                    <li>定期更新個人或企業資訊，確保資料正確性</li>
                    <li>對帳戶下的所有活動負完全責任</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    2.3 帳戶停用
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台保留在以下情況停用或終止帳戶的權利：
                    違反服務條款、提供虛假資訊、從事非法活動、惡意使用平台資源、
                    長期未使用帳戶、或其他損害平台利益之行為。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  3
                </span>
                使用者行為規範
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    3.1 禁止行為
                  </h3>
                  <p className="text-gray-700 mb-2">
                    使用本平台時，您不得從事以下行為：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>上傳虛假、誤導或不實的個人資料或職缺資訊</li>
                    <li>發布違法、猥褻、誹謗、歧視或仇恨言論</li>
                    <li>侵犯他人智慧財產權、隱私權或其他權利</li>
                    <li>散布病毒、惡意軟體或從事網路攻擊</li>
                    <li>大量發送垃圾訊息或從事詐騙活動</li>
                    <li>違法收集或使用其他使用者的個人資料</li>
                    <li>繞過技術保護措施或嘗試未經授權存取系統</li>
                    <li>建立多重帳戶或使用自動化程式操作</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    3.2 求職者責任
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>確保履歷資料真實準確，不得誇大或虛構</li>
                    <li>尊重企業招募流程，按時參與面試</li>
                    <li>如獲得工作機會，應誠實告知是否接受</li>
                    <li>不得同時應徵明顯衝突的職位</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    3.3 企業責任
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>確保職缺資訊真實，包括工作內容、薪資福利</li>
                    <li>遵守勞動相關法規，不得有歧視性要求</li>
                    <li>及時回應求職者應徵，維持良好溝通</li>
                    <li>保護求職者個人資料，不得用於其他用途</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  4
                </span>
                知識產權保護
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.1 平台知識產權
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台的所有內容，包括但不限於文字、圖片、標誌、軟體、介面設計、
                    資料庫及其編排，均受著作權、商標權及其他智慧財產權法律保護。
                    未經書面同意，不得複製、修改、散布或商業使用。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.2 使用者內容
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>您保留所上傳內容的著作權，但授權本平台使用</li>
                    <li>您聲明擁有上傳內容的合法權利</li>
                    <li>本平台可在提供服務範圍內使用您的內容</li>
                    <li>如有智慧財產權爭議，您應負完全責任</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    4.3 第三方內容
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台可能包含第三方網站連結或內容，這些內容的智慧財產權歸屬原權利人所有。
                    本平台不對第三方內容的準確性、合法性負責。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  5
                </span>
                服務費用與付費機制
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    5.1 免費服務
                  </h3>
                  <p className="text-gray-700 ml-4">
                    明道校友享有基本求職服務免費使用權，包括履歷建置、職缺搜尋、
                    基本應徵功能及校友網絡服務。
                  </p>
                </div>
                {/* 
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">5.2 付費服務</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li><strong>企業招募服務</strong>：職缺刊登、履歷搜尋、專案招募</li>
                    <li><strong>加值服務</strong>：履歷健診、職涯諮詢、專業培訓</li>
                    <li><strong>廣告服務</strong>：企業形象推廣、職缺優先曝光</li>
                    <li><strong>數據分析</strong>：招募效果分析、市場趨勢報告</li>
                  </ul>
                </div> */}

                {/* <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">5.3 付費條款</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>費用標準依本平台公告為準，可能隨時調整</li>
                    <li>付費服務採預付制，不提供退費（法令另有規定除外）</li>
                    <li>如有爭議，本平台保留最終解釋權</li>
                    <li>逾期未付費用者，本平台得暫停或終止服務</li>
                  </ul>
                </div> */}
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  6
                </span>
                免責聲明與責任限制
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    6.1 服務性質
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台僅提供資訊媒合服務，不保證求職成功或招募成效。
                    實際僱傭關係的建立、維持及終止，均由求職者與企業雇主自行負責。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    6.2 資訊免責
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>本平台不保證所有資訊的準確性、完整性或即時性</li>
                    <li>使用者應自行判斷資訊的可信度與適用性</li>
                    <li>因資訊錯誤導致的損失，本平台不承擔責任</li>
                    <li>第三方連結或廣告內容由提供者負責</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    6.3 技術免責
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>系統維護、升級或不可抗力導致的服務中斷</li>
                    <li>網路傳輸延遲、中斷或資料遺失</li>
                    <li>駭客攻擊、病毒感染等安全事件</li>
                    <li>使用者設備或軟體相容性問題</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">
                    <strong>重要聲明</strong>
                    ：本平台對於因使用服務而產生的任何直接、間接、
                    衍生或懲罰性損害，包括但不限於利潤損失、業務中斷、資料遺失等，
                    均不承擔賠償責任。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  7
                </span>
                服務修改與終止
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.1 服務變更
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台保留隨時修改、暫停或終止全部或部分服務的權利，
                    重大變更將提前 30
                    天通知使用者。持續使用服務視為同意變更內容。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.2 帳戶終止
                  </h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>
                      <strong>使用者主動</strong>
                      ：可隨時申請刪除帳戶，但應注意資料無法復原
                    </li>
                    <li>
                      <strong>平台終止</strong>
                      ：違反條款、長期未使用或其他合理原因
                    </li>
                    <li>
                      <strong>服務終止</strong>
                      ：帳戶終止後，相關權利義務關係消滅
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    7.3 資料處理
                  </h3>
                  <p className="text-gray-700 ml-4">
                    服務終止後，本平台將依隱私政策處理您的個人資料。
                    為符合法規要求，部分資料可能需保存一定期間。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  8
                </span>
                爭議解決與法律適用
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    8.1 爭議處理程序
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                    <li>
                      <strong>協商解決</strong>：優先透過客服管道進行溝通協商
                    </li>
                    <li>
                      <strong>調解程序</strong>：協商不成可申請相關調解機構調解
                    </li>
                    <li>
                      <strong>法律途徑</strong>：調解無效時，提交法院裁判解決
                    </li>
                  </ol>
                </div>
                {/* 
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">8.2 管轄法院</h3>
                  <p className="text-gray-700 ml-4">
                    因本服務條款所生之爭議，以台灣彰化地方法院為第一審管轄法院。
                    但不排除法律另有強制管轄規定的情形。
                  </p>
                </div> */}

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    8.2 適用法律
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本服務條款的解釋與適用，以中華民國法律為準。
                    如有部分條款因法律變更而無效，不影響其他條款的效力。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  9
                </span>
                其他重要事項
              </h2>
              <div className="ml-11 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    9.1 條款修改
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本平台保留隨時修改服務條款的權利。修改後的條款將在平台上公告，
                    重大修改將提前通知使用者。繼續使用服務視為同意修改後的條款。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    9.2 可分割性
                  </h3>
                  <p className="text-gray-700 ml-4">
                    如本條款任何部分被認定無效或不可執行，其餘部分仍然有效。
                    無效部分將被最接近原意圖的有效條款替代。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    9.3 完整協議
                  </h3>
                  <p className="text-gray-700 ml-4">
                    本服務條款連同隱私政策構成使用者與本平台之間的完整協議，
                    取代之前的所有口頭或書面約定。
                  </p>
                </div>
              </div>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                  10
                </span>
                聯絡資訊
              </h2>
              <div className="ml-11 space-y-3">
                <p className="text-gray-700">
                  如對本服務條款有任何疑問，請透過以下方式聯絡我們：
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
                    <strong>通訊地址</strong>
                    ：41401台中市烏日區中山路一段497號(明道樓5樓校友會館)
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
