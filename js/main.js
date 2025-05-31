// VNX-Netscan Main JavaScript Module
// Network Diagnostic Tool - Core functionality

import { IPLookupAPI } from '../api/ip-lookup.js';
import { PortScanAPI } from '../api/port-scan.js';
import { TracerouteAPI } from '../api/traceroute.js';
import { WHOISApi } from '../api/whois.js';

class VNXNetscan {
  constructor() {
    this.currentScan = null;
    this.scanResults = [];
    this.isScanning = false;
    this.userIP = null;
    
    this.initializeApp();
  }

  async initializeApp() {
    this.setupEventListeners();
    await this.detectUserIP();
    this.initializeAnalytics();
  }

  setupEventListeners() {
    // Target input and scan buttons
    document.getElementById('target-input')?.addEventListener('input', this.handleTargetInput.bind(this));
    document.getElementById('scan-my-ip')?.addEventListener('click', this.handleScanMyIP.bind(this));
    document.getElementById('clear-target')?.addEventListener('click', this.handleClearTarget.bind(this));
    
    // Scan tool buttons
    document.querySelectorAll('.scan-tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scanType = e.target.dataset.scanType;
        this.performScan(scanType);
      });
    });
    
    // Export and share buttons
    document.getElementById('export-results')?.addEventListener('click', this.exportResults.bind(this));
    document.getElementById('copy-results')?.addEventListener('click', this.copyResults.bind(this));
    document.getElementById('clear-results')?.addEventListener('click', this.clearResults.bind(this));
    
    // Social share buttons
    document.querySelectorAll('.social-share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platform = e.target.dataset.platform;
        this.shareToSocial(platform);
      });
    });
  }

  async detectUserIP() {
    try {
      const result = await IPLookupAPI.detectUserIP();
      if (result.success) {
        this.userIP = result.data.ip;
        this.updateUserIPDisplay(this.userIP);
      }
    } catch (error) {
      console.warn('Failed to detect user IP:', error);
    }
  }

  handleTargetInput(event) {
    const target = event.target.value.trim();
    this.updateScanButtonStates(target.length > 0);
  }

  async handleScanMyIP() {
    if (this.userIP) {
      document.getElementById('target-input').value = this.userIP;
      this.updateScanButtonStates(true);
      this.trackEvent('detect_user_ip', 'user_action', 'auto_fill');
    }
  }

  handleClearTarget() {
    document.getElementById('target-input').value = '';
    this.updateScanButtonStates(false);
  }

  async performScan(scanType) {
    const target = document.getElementById('target-input')?.value.trim();
    
    if (!target) {
      this.showNotification('Please enter an IP address or domain name', 'error');
      return;
    }

    if (this.isScanning) {
      this.showNotification('Scan already in progress...', 'warning');
      return;
    }

    this.isScanning = true;
    this.currentScan = scanType;
    this.updateScanStatus('scanning', scanType);
    this.trackEvent('scan_started', 'network_diagnostic', scanType);

    try {
      let result;
      
      switch (scanType) {
        case 'ip-lookup':
        case 'geo-info':
          result = await IPLookupAPI.lookup(target);
          break;
        case 'port-scan':
          result = await PortScanAPI.scan(target);
          break;
        case 'whois':
          result = await WHOISApi.lookup(target);
          break;
        case 'traceroute':
          result = await TracerouteAPI.trace(target);
          break;
        case 'bulk':
          result = await this.performBulkScan(target);
          break;
        default:
          throw new Error(`Unknown scan type: ${scanType}`);
      }

      if (result.success) {
        const scanResult = {
          type: scanType,
          data: result.data,
          timestamp: new Date().toISOString(),
          target: target
        };

        this.scanResults.unshift(scanResult);
        this.displayScanResult(scanResult);
        this.updateResultsCounter();
        this.trackEvent('scan_completed', 'network_diagnostic', scanType);
      } else {
        throw new Error(result.error || 'Scan failed');
      }
      
    } catch (error) {
      console.error(`${scanType} failed:`, error);
      this.showNotification(`Scan failed: ${error.message}`, 'error');
      this.trackEvent('scan_failed', 'network_diagnostic', scanType);
    } finally {
      this.isScanning = false;
      this.currentScan = null;
      this.updateScanStatus('ready');
    }
  }

  async performBulkScan(target) {
    const scanTypes = ['ip-lookup', 'port-scan', 'whois', 'traceroute'];
    const results = {};
    
    for (const scanType of scanTypes) {
      try {
        let result;
        switch (scanType) {
          case 'ip-lookup':
            result = await IPLookupAPI.lookup(target);
            break;
          case 'port-scan':
            result = await PortScanAPI.scan(target);
            break;
          case 'whois':
            result = await WHOISApi.lookup(target);
            break;
          case 'traceroute':
            result = await TracerouteAPI.trace(target);
            break;
        }
        
        if (result.success) {
          results[scanType] = result.data;
        }
      } catch (error) {
        console.warn(`Bulk scan ${scanType} failed:`, error);
      }
    }
    
    return {
      success: true,
      data: {
        target,
        results
      }
    };
  }

  exportResults() {
    if (this.scanResults.length === 0) {
      this.showNotification('No results to export', 'warning');
      return;
    }

    const exportData = {
      generatedBy: 'VNX-Netscan',
      timestamp: new Date().toISOString(),
      results: this.scanResults
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileName = `vnx-netscan-results-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
    
    this.trackEvent('export_results', 'user_action', 'json_download');
    this.showNotification('Results exported successfully', 'success');
  }

  copyResults() {
    if (this.scanResults.length === 0) {
      this.showNotification('No results to copy', 'warning');
      return;
    }

    const resultsText = this.scanResults.map(result => 
      `=== ${result.type.toUpperCase()} RESULTS ===\n` +
      `Target: ${result.target}\n` +
      `Timestamp: ${result.timestamp}\n` +
      `Data: ${JSON.stringify(result.data, null, 2)}\n\n`
    ).join('');

    navigator.clipboard.writeText(resultsText).then(() => {
      this.showNotification('Results copied to clipboard!', 'success');
      this.trackEvent('copy_results', 'user_action', 'clipboard');
    }).catch(() => {
      this.showNotification('Failed to copy results', 'error');
    });
  }

  clearResults() {
    this.scanResults = [];
    this.updateResultsDisplay();
    this.updateResultsCounter();
    this.trackEvent('clear_results', 'user_action', 'reset');
    this.showNotification('Results cleared', 'success');
  }

  shareToSocial(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this professional network diagnostic tool by VNX-Netscan! 🔍 Get comprehensive IP lookup, port scanning, WHOIS, and traceroute analysis. #NetworkDiagnostics #VNXNetscan');
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text} ${url}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
      this.trackEvent('social_share', 'user_action', platform);
    }
  }

  // UI Update Methods
  updateScanButtonStates(enabled) {
    document.querySelectorAll('.scan-tool-btn').forEach(btn => {
      btn.disabled = !enabled || this.isScanning;
    });
  }

  updateScanStatus(status, scanType = '') {
    const statusElement = document.getElementById('scan-status');
    if (statusElement) {
      statusElement.textContent = status === 'scanning' ? `Running ${scanType}...` : 'Ready to scan';
      statusElement.className = status === 'scanning' ? 'status-scanning' : 'status-online';
    }
  }

  updateUserIPDisplay(ip) {
    const ipElement = document.getElementById('user-ip-display');
    if (ipElement) {
      ipElement.textContent = ip;
    }
  }

  updateResultsCounter() {
    const counterElement = document.getElementById('results-counter');
    if (counterElement) {
      const count = this.scanResults.length;
      counterElement.textContent = `${count} scan${count !== 1 ? 's' : ''} completed`;
    }
  }

  displayScanResult(result) {
    const resultsContainer = document.getElementById('scan-results');
    if (resultsContainer) {
      const resultElement = this.createResultElement(result);
      resultsContainer.prepend(resultElement);
    }
  }

  createResultElement(result) {
    const element = document.createElement('div');
    element.className = 'vnx-card result-item';
    element.innerHTML = `
      <div class="result-header">
        <h3>${result.type.replace('-', ' ').toUpperCase()}</h3>
        <span class="result-timestamp">${new Date(result.timestamp).toLocaleString()}</span>
      </div>
      <div class="result-content">
        <pre class="terminal-output">${JSON.stringify(result.data, null, 2)}</pre>
      </div>
    `;
    return element;
  }

  updateResultsDisplay() {
    const resultsContainer = document.getElementById('scan-results');
    if (resultsContainer) {
      resultsContainer.innerHTML = '';
    }
  }

  showNotification(message, type = 'info') {
    // Create or update notification element
    let notification = document.getElementById('vnx-notification');
    if (!notification) {
      notification = document.createElement('div');
      notification.id = 'vnx-notification';
      document.body.appendChild(notification);
    }
    
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
      notification.style.display = 'none';
    }, 3000);
  }

  // Analytics Methods
  initializeAnalytics() {
    // Initialize Google Analytics if measurement ID is available
    if (window.gtag) {
      console.log('Google Analytics initialized');
    }
  }

  trackEvent(action, category, label) {
    if (window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label
      });
    }
    console.log(`Analytics: ${action} - ${category} - ${label}`);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.vnxNetscan = new VNXNetscan();
});

// Export for module usage
export default VNXNetscan;