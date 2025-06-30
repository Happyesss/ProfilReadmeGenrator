import { useState, useEffect } from 'react';
import { FileText, Eye, Code, ExternalLink, AlertCircle, CheckCircle, Loader, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface ReadmePreviewProps {
  markdown: string;
}

export default function ReadmePreview({ markdown }: ReadmePreviewProps) {
  const [viewMode, setViewMode] = useState<'rendered' | 'markdown'>('rendered');
  const [debouncedMarkdown, setDebouncedMarkdown] = useState(markdown);
  const [imageLoadStatus, setImageLoadStatus] = useState<{[key: string]: 'loading' | 'loaded' | 'error'}>({});
  const [retryAttempts, setRetryAttempts] = useState<{[key: string]: number}>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMarkdown(markdown);
      // Reset image status when markdown changes
      setImageLoadStatus({});
      setRetryAttempts({});
    }, 500);

    return () => clearTimeout(timer);
  }, [markdown]);

  // Create a standalone HTML page with embedded markdown
  const createStandalonePreview = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub README Preview</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #24292f;
            max-width: 1012px;
            margin: 0 auto;
            padding: 16px;
            background: #ffffff;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background: #0d1117;
                color: #c9d1d9;
            }
        }
        @media (min-width: 768px) {
            body { padding: 20px; }
        }
        h1, h2 { border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
        @media (prefers-color-scheme: dark) {
            h1, h2 { border-bottom-color: #21262d; }
        }
        h1 { font-size: 1.75em; margin-bottom: 16px; }
        h2 { font-size: 1.5em; margin-top: 24px; margin-bottom: 16px; }
        h3 { font-size: 1.25em; margin-top: 24px; margin-bottom: 16px; }
        @media (min-width: 768px) {
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            h3 { font-size: 1.25em; }
        }
        p { margin-bottom: 16px; }
        img { max-width: 100%; height: auto; }
        code { 
            background: #f6f8fa; 
            padding: 2px 4px; 
            border-radius: 3px; 
            font-size: 85%; 
        }
        @media (prefers-color-scheme: dark) {
            code { background: #161b22; }
        }
        pre { 
            background: #f6f8fa; 
            padding: 16px; 
            border-radius: 6px; 
            overflow: auto; 
        }
        @media (prefers-color-scheme: dark) {
            pre { background: #161b22; }
        }
        a { color: #0969da; text-decoration: none; }
        @media (prefers-color-scheme: dark) {
            a { color: #58a6ff; }
        }
        a:hover { text-decoration: underline; }
        .github-stats-container { text-align: center; margin: 20px 0; }
        .github-stats-container img { 
            margin: 10px; 
            border-radius: 8px; 
            box-shadow: 0 1px 3px rgba(0,0,0,0.12); 
        }
        ul, ol { padding-left: 2em; }
        li { margin-bottom: 0.25em; }
        blockquote { 
            border-left: 4px solid #d0d7de; 
            padding-left: 16px; 
            color: #656d76; 
        }
        @media (prefers-color-scheme: dark) {
            blockquote { 
                border-left-color: #30363d; 
                color: #8b949e; 
            }
        }
        hr { 
            border: none; 
            border-top: 1px solid #d0d7de; 
            margin: 24px 0; 
        }
        @media (prefers-color-scheme: dark) {
            hr { border-top-color: #21262d; }
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 16px 0; 
            overflow-x: auto; 
            display: block; 
            white-space: nowrap; 
        }
        @media (min-width: 768px) {
            table { display: table; white-space: normal; }
        }
        th, td { 
            border: 1px solid #d0d7de; 
            padding: 6px 8px; 
            text-align: left; 
        }
        @media (prefers-color-scheme: dark) {
            th, td { border-color: #30363d; }
        }
        @media (min-width: 768px) {
            th, td { padding: 8px 12px; }
        }
        th { 
            background: #f6f8fa; 
            font-weight: 600; 
        }
        @media (prefers-color-scheme: dark) {
            th { background: #161b22; }
        }
    </style>
</head>
<body>
    <div id="content"></div>
    
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        // Store the markdown content
        const markdownContent = ${JSON.stringify(debouncedMarkdown)};
        
        function renderMarkdown() {
            try {
                // Wait for marked to load, then render
                if (typeof marked !== 'undefined') {
                    document.getElementById('content').innerHTML = marked.parse(markdownContent);
                    
                    // Add GitHub-like styling to images
                    document.querySelectorAll('img').forEach(img => {
                        if (img.src.includes('github-readme-stats') || 
                            img.src.includes('github-readme-streak-stats') || 
                            img.src.includes('github-contribution-grid-snake') ||
                            img.src.includes('github-readme-activity-graph') ||
                            img.src.includes('github-profile-trophy') ||
                            img.src.includes('komarev.com') ||
                            img.src.includes('readme-typing-svg')) {
                            img.style.display = 'block';
                            img.style.margin = '10px auto';
                            img.style.borderRadius = '8px';
                            img.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)';
                        }
                    });
                    
                    console.log('✅ README preview rendered successfully');
                } else {
                    // Retry if marked hasn't loaded yet
                    setTimeout(renderMarkdown, 100);
                }
            } catch (error) {
                console.error('❌ Error rendering markdown:', error);
                document.getElementById('content').innerHTML = '<div style="padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #dc3545;"><h3>⚠️ Preview Error</h3><p>There was an error rendering the markdown preview. Please check the console for details.</p></div>';
            }
        }
        
        // Wait for page to load completely before rendering
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', renderMarkdown);
        } else {
            renderMarkdown();
        }
    </script>
</body>
</html>`;

    return htmlContent;
  };

  // Open preview in new tab with persistent content
  const openInNewTab = () => {
    try {
      const htmlContent = createStandalonePreview();
      
      // Create a new window and write content directly
      const newWindow = window.open('', '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
      
      if (newWindow) {
        // Write the HTML content directly to the new window
        newWindow.document.open();
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        
        // Set a proper title
        newWindow.document.title = 'GitHub README Preview - ProfileCraft Pro';
        
        // Focus the new window
        newWindow.focus();
        
        console.log('✅ Preview opened in new tab successfully');
      } else {
        // Fallback: create downloadable HTML file if popup is blocked
        console.log('🚫 Popup blocked, downloading file instead');
        downloadPreviewFile(htmlContent);
      }
    } catch (error) {
      console.error('❌ Error opening preview:', error);
      // Fallback to download
      downloadPreviewFile(createStandalonePreview());
    }
  };

  const downloadPreviewFile = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'README-preview.html';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show a user-friendly notification
    alert('📥 Preview downloaded as README-preview.html\n\nPlease check your downloads folder and open the file in your browser to see the full preview with GitHub stats!');
  };

  // Detect GitHub stats services
  const isGitHubStatsService = (src: string) => {
    return src.includes('github-readme-stats') || 
           src.includes('github-readme-streak-stats') || 
           src.includes('github-contribution-grid-snake') ||
           src.includes('github-readme-activity-graph') ||
           src.includes('github-profile-trophy') ||
           src.includes('komarev.com') ||
           src.includes('herokuapp.com') ||
           src.includes('readme-typing-svg') ||
           src.includes('vercel.app');
  };

  const getServiceName = (src: string) => {
    if (src.includes('github-readme-stats')) return 'GitHub Stats';
    if (src.includes('github-readme-streak-stats')) return 'GitHub Streak';
    if (src.includes('github-contribution-grid-snake')) return 'Snake Animation';
    if (src.includes('github-readme-activity-graph')) return 'Activity Graph';
    if (src.includes('github-profile-trophy')) return 'GitHub Trophies';
    if (src.includes('komarev.com')) return 'Profile Views';
    if (src.includes('readme-typing-svg')) return 'Animated Header';
    return 'GitHub Service';
  };

  const handleImageLoad = (src: string) => {
    setImageLoadStatus(prev => ({ ...prev, [src]: 'loaded' }));
  };

  const handleImageError = (src: string) => {
    const currentAttempts = retryAttempts[src] || 0;
    
    if (currentAttempts < 2 && isGitHubStatsService(src)) {
      // Retry up to 2 times for GitHub services
      setRetryAttempts(prev => ({ ...prev, [src]: currentAttempts + 1 }));
      setImageLoadStatus(prev => ({ ...prev, [src]: 'loading' }));
      
      // Log the retry attempt
      console.log(`[README Preview] Retrying ${getServiceName(src)} (attempt ${currentAttempts + 1}/2): ${src}`);
      
      // Force reload after a short delay
      setTimeout(() => {
        const img = document.querySelector(`img[src="${src}"]`) as HTMLImageElement;
        if (img) {
          img.src = src + (src.includes('?') ? '&' : '?') + '_retry=' + Date.now();
        }
      }, 1000);
    } else {
      setImageLoadStatus(prev => ({ ...prev, [src]: 'error' }));
      // Only log console errors for non-GitHub stats services, as CORS failures are expected for GitHub services
      if (!isGitHubStatsService(src)) {
        console.error(`[README Preview] Failed to load ${getServiceName(src)} after ${currentAttempts + 1} attempts: ${src}`);
      }
    }
  };

  const handleImageLoadStart = (src: string) => {
    setImageLoadStatus(prev => ({ ...prev, [src]: 'loading' }));
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 lg:h-5 lg:w-5 text-gray-400" />
          <span className="text-sm lg:text-base text-gray-300 font-medium">README.md Preview</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-2">
          <button
            onClick={openInNewTab}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-all text-gray-400 hover:text-white hover:bg-gray-700"
            title="Open persistent preview in new tab"
          >
            <ExternalLink className="h-4 w-4" />
            <span>New Tab</span>
          </button>
          <button
            onClick={() => setViewMode('rendered')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-all ${
              viewMode === 'rendered'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            onClick={() => setViewMode('markdown')}
            className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-all ${
              viewMode === 'markdown'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <Code className="h-4 w-4" />
            <span>Markdown</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="sm:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
        >
          {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-2">
            <button
              onClick={openInNewTab}
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm transition-all text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Open Persistent Preview</span>
            </button>
            <button
              onClick={() => {
                setViewMode('rendered');
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${
                viewMode === 'rendered'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Eye className="h-4 w-4" />
              <span>Preview Mode</span>
            </button>
            <button
              onClick={() => {
                setViewMode('markdown');
                setIsMenuOpen(false);
              }}
              className={`flex items-center space-x-2 w-full px-3 py-2 rounded-lg text-sm transition-all ${
                viewMode === 'markdown'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Code className="h-4 w-4" />
              <span>Markdown Mode</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-4 lg:p-6">
        {viewMode === 'rendered' ? (
          <div className="prose prose-invert prose-blue max-w-none">
            <div className="bg-white rounded-lg p-4 lg:p-6 text-gray-900 max-h-80 lg:max-h-96 overflow-y-auto">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl lg:text-3xl font-bold mb-4 text-gray-900 border-b border-gray-200 pb-2">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl lg:text-2xl font-semibold mb-3 text-gray-900 border-b border-gray-200 pb-1 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg lg:text-xl font-semibold mb-2 text-gray-900 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <div className="mb-4 text-gray-700 leading-relaxed text-sm lg:text-base">
                      {children}
                    </div>
                  ),
                  a: ({ href, children }) => (
                    <a
                      href={href}
                      className="text-blue-600 hover:text-blue-800 underline break-words"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  img: ({ src, alt }) => {
                    if (!src) return null;
                    
                    const isGitHubService = isGitHubStatsService(src);
                    const serviceName = getServiceName(src);
                    const loadStatus = imageLoadStatus[src] || 'loading';
                    const attempts = retryAttempts[src] || 0;
                    
                    // For GitHub services, try to load them but show status
                    if (isGitHubService) {
                      return (
                        <div className="my-4 relative">
                          <div className="text-center">
                            <img
                              src={src}
                              alt={alt}
                              className="max-w-full h-auto rounded-lg shadow-sm mx-auto"
                              loading="lazy"
                              onLoad={() => handleImageLoad(src)}
                              onError={() => handleImageError(src)}
                              onLoadStart={() => handleImageLoadStart(src)}
                              crossOrigin="anonymous"
                              referrerPolicy="no-referrer"
                              style={{ 
                                display: loadStatus === 'error' ? 'none' : 'block',
                                opacity: loadStatus === 'loading' ? 0.7 : 1
                              }}
                            />
                            
                            {/* Loading indicator */}
                            {loadStatus === 'loading' && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg">
                                <div className="text-center p-4">
                                  <Loader className="h-6 w-6 animate-spin text-blue-500 mx-auto mb-2" />
                                  <p className="text-xs lg:text-sm text-gray-600">
                                    Loading {serviceName}...
                                    {attempts > 0 && ` (Retry ${attempts}/2)`}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {/* Error fallback */}
                            {loadStatus === 'error' && (
                              <div className="flex items-center justify-center p-4 lg:p-6 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-dashed border-red-200 rounded-lg">
                                <div className="text-center max-w-md">
                                  <div className="flex items-center justify-center mb-3">
                                    <AlertCircle className="h-6 w-6 lg:h-8 lg:w-8 text-red-500" />
                                  </div>
                                  <h4 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                                    {serviceName} - Load Failed
                                  </h4>
                                  <p className="text-xs lg:text-sm text-gray-600 mb-3">
                                    Preview not available (browser security)
                                  </p>
                                  <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                                    <div className="flex items-center justify-center space-x-2 text-xs mb-2">
                                      <CheckCircle className="h-3 w-3 text-green-500" />
                                      <span className="text-green-600 font-medium">
                                        Will work perfectly in your GitHub README
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                      Open a new tab to see the full preview, which is free of limitations.
                                    </p>
                                  </div>
                                  <button
                                    onClick={openInNewTab}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                                  >
                                   Open new tab
                                  </button>
                                </div>
                              </div>
                            )}
                            
                            {/* Success indicator */}
                            {loadStatus === 'loaded' && (
                              <div className="mt-2 flex items-center justify-center space-x-1 text-xs text-green-600">
                                <CheckCircle className="h-3 w-3" />
                                <span>{serviceName} loaded successfully</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    
                    // For non-GitHub services, show normally
                    return (
                      <div className="my-4">
                        <img
                          src={src}
                          alt={alt}
                          className="max-w-full h-auto rounded-lg shadow-sm"
                          loading="lazy"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    );
                  },
                  code: ({ children, className }) => {
                    const isInline = !className;
                    return isInline ? (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-xs lg:text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ) : (
                      <code className="block bg-gray-100 p-3 rounded-lg text-xs lg:text-sm font-mono text-gray-800 overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700 text-sm lg:text-base">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700 text-sm lg:text-base">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 text-sm lg:text-base">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4 text-sm lg:text-base">
                      {children}
                    </blockquote>
                  ),
                  hr: () => (
                    <hr className="border-gray-300 my-6" />
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full border-collapse border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-2 lg:px-4 py-2 bg-gray-50 font-semibold text-left text-xs lg:text-sm">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-2 lg:px-4 py-2 text-xs lg:text-sm">
                      {children}
                    </td>
                  ),
                }}
              >
                {debouncedMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        ) : (
          <pre className="text-xs lg:text-sm text-gray-300 whitespace-pre-wrap font-mono bg-gray-900/50 rounded-lg p-4 max-h-80 lg:max-h-96 overflow-y-auto border border-gray-700">
            {debouncedMarkdown}
          </pre>
        )}
      </div>
      
      {/* GitHub Compatibility Information */}
      {viewMode === 'rendered' && (
        <div className="px-4 lg:px-6 pb-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-3 w-3 lg:h-4 lg:w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-green-300">
                <strong>GitHub Compatibility:</strong> All services work perfectly in your actual GitHub README. 
                Preview limitations are browser-specific and don't affect GitHub\'s rendering.
                <br />
                <strong>💡 Tip:</strong> Use "New Tab" for a persistent preview that won't disappear on reload.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}