/**
 * CyberPehra Central Event Delegation Module
 * Replaces all inline HTML onclick attributes for strict Content Security Policy (CSP) compliance.
 */

export function initEventBindings() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.getAttribute('data-action');
    const arg = target.getAttribute('data-arg');

    switch (action) {
      // Navigation & Layout Controls
      case 'toggleMobileMenu':
        if (typeof window.toggleMobileMenu === 'function') window.toggleMobileMenu();
        break;
      case 'printPage':
        window.print();
        break;
      case 'switchLanguage':
        if (typeof window.switchLanguage === 'function') window.switchLanguage(arg);
        break;
      case 'setLanguageDesktop':
        if (typeof window.setLanguage === 'function') window.setLanguage(arg);
        if (typeof window.toggleLangMenu === 'function') window.toggleLangMenu(true);
        break;
      case 'switchLanguageMobile':
        if (typeof window.switchLanguage === 'function') window.switchLanguage(arg);
        if (typeof window.toggleMobileMenu === 'function') window.toggleMobileMenu();
        break;
      case 'switchDashboardView':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView(arg);
        break;
      case 'switchDashboardViewMobile':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView(arg);
        if (typeof window.toggleMobileMenu === 'function') window.toggleMobileMenu();
        break;
      case 'switchScannerUrlMobile':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('url');
        if (typeof window.toggleMobileMenu === 'function') window.toggleMobileMenu();
        break;
      case 'switchScannerUrl':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('url');
        break;
      case 'switchScannerFile':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('file');
        break;
      case 'switchScannerChat':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('msg');
        break;
      case 'switchScannerQr':
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('qr');
        break;
      case 'switchMode':
        if (typeof window.switchMode === 'function') window.switchMode(arg);
        break;
      case 'openModal':
        if (typeof window.openModal === 'function') window.openModal(arg);
        break;
      case 'openModalMobile':
        if (typeof window.openModal === 'function') window.openModal(arg);
        if (typeof window.toggleMobileMenu === 'function') window.toggleMobileMenu();
        break;
      case 'closeSimpleModal':
        if (typeof window.closeSimpleModal === 'function') window.closeSimpleModal();
        break;

      // Scanner Actions
      case 'quickScan':
        if (typeof window.quickScan === 'function') window.quickScan(arg);
        break;
      case 'handleScan':
        if (typeof window.handleScan === 'function') window.handleScan();
        break;
      case 'fillSampleMsg':
        if (typeof window.fillSampleMsg === 'function') window.fillSampleMsg(arg);
        break;
      case 'clearMsgText':
        if (typeof window.clearMsgText === 'function') window.clearMsgText();
        break;
      case 'stopQrScanner':
        if (typeof window.stopQrScanner === 'function') window.stopQrScanner();
        break;
      case 'downloadScannerPDFReport':
        if (typeof window.downloadScannerPDFReport === 'function') window.downloadScannerPDFReport();
        break;
      case 'resetScannerWorkspace':
        if (typeof window.resetScannerWorkspace === 'function') window.resetScannerWorkspace();
        break;

      // PWA & Intel
      case 'triggerPWAInstall':
        if (typeof window.triggerPWAInstall === 'function') window.triggerPWAInstall();
        break;
      case 'refreshCyberIntel':
        if (typeof window.refreshCyberIntel === 'function') window.refreshCyberIntel();
        break;

      // Encyclopedia & Tools
      case 'setEncyclopediaCategory':
        if (typeof window.setEncyclopediaCategory === 'function') window.setEncyclopediaCategory(arg);
        break;
      case 'filterHelplineCategory':
        if (typeof window.filterHelplineCategory === 'function') window.filterHelplineCategory(arg);
        break;
      case 'filterChecklistCategory':
        if (typeof window.filterChecklistCategory === 'function') window.filterChecklistCategory(arg);
        break;
      case 'clearScamSearch':
        if (typeof window.clearScamSearch === 'function') window.clearScamSearch();
        break;
      case 'filterScamsCategory':
        if (typeof window.filterScamsCategory === 'function') window.filterScamsCategory(arg);
        break;
      case 'openScamDetails':
        if (typeof window.openScamDetails === 'function') window.openScamDetails(arg);
        break;
      case 'executeRelatedScamTool':
        if (typeof window.executeRelatedScamTool === 'function') window.executeRelatedScamTool(arg);
        break;
      case 'executeFixTool':
        if (typeof window.executeFixTool === 'function') window.executeFixTool(arg);
        break;
      case 'selectLawCase':
        if (typeof window.selectLawCase === 'function') window.selectLawCase(arg);
        break;
      case 'downloadEmergencyActionPDF':
        if (typeof window.downloadEmergencyActionPDF === 'function') window.downloadEmergencyActionPDF();
        break;
      case 'downloadCyberHygienePDFReport':
        if (typeof window.downloadCyberHygienePDFReport === 'function') window.downloadCyberHygienePDFReport();
        break;

      // Security Utilities
      case 'copyPassword':
        if (typeof window.copyPassword === 'function') window.copyPassword();
        break;
      case 'runPasswordBreachCheck':
        if (typeof window.runPasswordBreachCheck === 'function') window.runPasswordBreachCheck();
        break;
      case 'copyQRText':
        if (typeof window.copyQRText === 'function') window.copyQRText();
        break;
      case 'runWhoisLookup':
        if (typeof window.runWhoisLookup === 'function') window.runWhoisLookup();
        break;
      case 'runIpLookup':
        if (typeof window.runIpLookup === 'function') window.runIpLookup();
        break;
      case 'runDnsLookup':
        if (typeof window.runDnsLookup === 'function') window.runDnsLookup();
        break;

      // Quiz Actions
      case 'startCyberQuiz':
        if (typeof window.startCyberQuiz === 'function') window.startCyberQuiz();
        break;
      case 'submitQuizAnswer':
        if (typeof window.submitQuizAnswer === 'function') window.submitQuizAnswer(parseInt(arg, 10));
        break;
      case 'nextQuizQuestion':
        if (typeof window.nextQuizQuestion === 'function') window.nextQuizQuestion();
        break;
      case 'resetCyberQuiz':
        if (typeof window.resetCyberQuiz === 'function') window.resetCyberQuiz();
        break;

      // Screenshot Analyzer Workspace Actions
      case 'closeScreenshotWorkspace':
        if (typeof window.closeScreenshotWorkspace === 'function') window.closeScreenshotWorkspace();
        break;
      case 'toggleWorkspaceLangMenu':
        if (typeof window.toggleWorkspaceLangMenu === 'function') window.toggleWorkspaceLangMenu(arg ? arg === 'true' : undefined);
        break;
      case 'setLanguage':
        if (typeof window.setLanguage === 'function') window.setLanguage(arg);
        break;
      case 'setActiveScreenshotIndex':
        if (typeof window.setActiveScreenshotIndex === 'function') window.setActiveScreenshotIndex(parseInt(arg, 10));
        break;
      case 'clearAllScreenshots':
        if (typeof window.clearAllScreenshots === 'function') window.clearAllScreenshots();
        break;
      case 'startScreenshotInvestigation':
        if (typeof window.startScreenshotInvestigation === 'function') window.startScreenshotInvestigation();
        break;
      case 'adjustScreenshotZoom':
        if (typeof window.adjustScreenshotZoom === 'function') window.adjustScreenshotZoom(parseFloat(arg));
        break;
      case 'rotateScreenshotCanvas':
        if (typeof window.rotateScreenshotCanvas === 'function') window.rotateScreenshotCanvas();
        break;
      case 'resetScreenshotCanvasView':
        if (typeof window.resetScreenshotCanvasView === 'function') window.resetScreenshotCanvasView();
        break;
      case 'toggleScreenshotRedactMode':
        if (typeof window.toggleScreenshotRedactMode === 'function') window.toggleScreenshotRedactMode();
        break;
      case 'clearScreenshotRedactions':
        if (typeof window.clearScreenshotRedactions === 'function') window.clearScreenshotRedactions();
        break;
      case 'cancelScreenshotScan':
        if (typeof window.cancelScreenshotScan === 'function') window.cancelScreenshotScan();
        break;
      case 'downloadScreenshotPDFReport':
        if (typeof window.downloadScreenshotPDFReport === 'function') window.downloadScreenshotPDFReport();
        break;
      case 'copyScreenshotReportText':
        if (typeof window.copyScreenshotReportText === 'function') window.copyScreenshotReportText();
        break;
      case 'launchUrlScannerWithInput':
        if (arg) {
          const urlInput = document.getElementById('urlInput');
          if (urlInput) urlInput.value = arg;
        }
        if (typeof window.closeScreenshotWorkspace === 'function') window.closeScreenshotWorkspace();
        if (typeof window.switchDashboardView === 'function') window.switchDashboardView('scanner');
        if (typeof window.switchMode === 'function') window.switchMode('url');
        break;

      // India Cyber Threat Map Actions
      case 'resetMapToNationalView':
        if (typeof window.resetMapToNationalView === 'function') window.resetMapToNationalView();
        break;
      case 'selectStateView':
        if (typeof window.selectStateView === 'function') window.selectStateView(arg);
        break;
      case 'setMapTimeFilter':
        if (typeof window.setMapTimeFilter === 'function') window.setMapTimeFilter(arg);
        break;
      case 'toggleMap3DTilt':
        if (typeof window.toggleMap3DTilt === 'function') window.toggleMap3DTilt();
        break;
      case 'zoomMapCanvas':
        if (typeof window.zoomMapCanvas === 'function') window.zoomMapCanvas(parseFloat(arg));
        break;
      case 'resetMapCanvasTransform':
        if (typeof window.resetMapCanvasTransform === 'function') window.resetMapCanvasTransform();
        break;
      case 'selectDistrictView':
        if (typeof window.selectDistrictView === 'function') window.selectDistrictView(arg);
        break;
      case 'openFullNewsReportPage':
        if (typeof window.openFullNewsReportPage === 'function') window.openFullNewsReportPage(arg);
        break;
      default:
        break;
    }
  });
}
