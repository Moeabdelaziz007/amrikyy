// LinkedIn Viral Post Generator
class LinkedInGenerator {
    constructor() {
        this.selectedTone = 'inspirational';
        this.newsData = [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Keyword input
        const keywordInput = document.getElementById('keyword');
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.fetchNews();
            }
        });

        // Fetch news button
        document.getElementById('fetchNewsBtn').addEventListener('click', () => {
            this.fetchNews();
        });

        // Tone selection
        document.querySelectorAll('.tone-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectTone(btn.dataset.tone);
                this.updateToneButtons(btn);
            });
        });

        // Generate post button
        document.getElementById('generatePostBtn').addEventListener('click', () => {
            this.generatePost();
        });

        // Copy button
        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });
    }

    selectTone(tone) {
        this.selectedTone = tone;
    }

    updateToneButtons(selectedBtn) {
        document.querySelectorAll('.tone-btn').forEach(btn => {
            if (btn === selectedBtn) {
                btn.className = 'tone-btn w-full p-4 rounded-lg border-2 border-blue-500 bg-blue-50 text-right transition-all';
            } else {
                btn.className = 'tone-btn w-full p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-right transition-all';
            }
        });
    }

    async fetchNews() {
        const keyword = document.getElementById('keyword').value.trim();
        
        if (!keyword) {
            this.showError('الرجاء إدخال كلمة مفتاحية');
            return;
        }

        const fetchBtn = document.getElementById('fetchNewsBtn');
        const originalContent = fetchBtn.innerHTML;
        
        // Show loading
        fetchBtn.innerHTML = '<i data-lucide="refresh-cw" class="w-4 h-4 animate-spin"></i> جاري البحث...';
        fetchBtn.disabled = true;
        
        this.hideError();

        try {
            // Since we can't make API calls directly from client-side due to CORS,
            // we'll generate mock news data for demonstration
            await this.delay(2000); // Simulate API call
            
            this.newsData = this.generateMockNews(keyword);
            this.displayNews();
            
        } catch (error) {
            this.showError('حدث خطأ في جلب الأخبار');
            console.error('Error:', error);
        } finally {
            fetchBtn.innerHTML = originalContent;
            fetchBtn.disabled = false;
            lucide.createIcons(); // Reinitialize icons
        }
    }

    generateMockNews(keyword) {
        return [
            {
                title: `Latest ${keyword} Developments Shake Industry`,
                description: `Revolutionary ${keyword} breakthrough promises to transform how businesses operate worldwide.`,
                source: { name: 'Tech News Daily' },
                publishedAt: new Date().toISOString()
            },
            {
                title: `${keyword} Market Reaches New Heights`,
                description: `Industry experts predict massive growth in ${keyword} sector with new innovations driving change.`,
                source: { name: 'Business Insider' },
                publishedAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                title: `Top Companies Invest Heavily in ${keyword}`,
                description: `Major corporations announce billion-dollar investments in ${keyword} technology and infrastructure.`,
                source: { name: 'Financial Times' },
                publishedAt: new Date(Date.now() - 7200000).toISOString()
            }
        ];
    }

    displayNews() {
        const newsSection = document.getElementById('newsSection');
        const newsList = document.getElementById('newsList');
        
        newsList.innerHTML = '';
        
        this.newsData.forEach((item, index) => {
            const newsItem = document.createElement('div');
            newsItem.className = 'p-3 border border-gray-100 rounded-lg hover:bg-gray-50';
            newsItem.innerHTML = `
                <h4 class="font-medium text-sm line-clamp-2 mb-1">${item.title}</h4>
                <p class="text-xs text-gray-600 line-clamp-2 mb-2">${item.description}</p>
                <div class="flex items-center justify-between">
                    <span class="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        ${item.source.name}
                    </span>
                    <span class="text-xs text-gray-500">
                        ${new Date(item.publishedAt).toLocaleDateString('ar')}
                    </span>
                </div>
            `;
            newsList.appendChild(newsItem);
        });
        
        newsSection.classList.remove('hidden');
    }

    async generatePost() {
        if (this.newsData.length === 0) {
            this.showError('الرجاء جلب الأخبار أولاً');
            return;
        }

        const generateBtn = document.getElementById('generatePostBtn');
        const originalContent = generateBtn.innerHTML;
        
        // Show loading
        generateBtn.innerHTML = '<i data-lucide="refresh-cw" class="w-4 h-4 animate-spin"></i> جاري التوليد...';
        generateBtn.disabled = true;
        
        this.hideError();

        try {
            await this.delay(3000); // Simulate AI generation
            
            const keyword = document.getElementById('keyword').value.trim();
            const generatedPost = this.generateMockPost(keyword, this.selectedTone);
            this.displayGeneratedPost(generatedPost);
            
        } catch (error) {
            this.showError('حدث خطأ في توليد المنشور');
            console.error('Error:', error);
        } finally {
            generateBtn.innerHTML = originalContent;
            generateBtn.disabled = false;
            lucide.createIcons(); // Reinitialize icons
        }
    }

    generateMockPost(keyword, tone) {
        const hooks = {
            inspirational: `The future of ${keyword} is here! 🚀`,
            technical: `Breaking: ${keyword} technology advances rapidly.`,
            storytelling: `I just discovered something incredible about ${keyword}...`
        };

        const content = `${hooks[tone]}

The latest developments in ${keyword} are reshaping our industry in ways we never imagined.

Just witnessed major breakthroughs that will impact how we work, innovate, and grow in the next decade.

This isn't just another trend – it's a fundamental shift that smart businesses are already leveraging.

The question isn't whether ${keyword} will transform your industry.

The question is: Will you be leading the change or catching up?

What's your take on the ${keyword} revolution? Are you ready for what's coming next?`;

        return {
            content,
            hashtags: [keyword.toLowerCase(), 'innovation', 'technology', 'future', 'business'],
            tone
        };
    }

    displayGeneratedPost(post) {
        const postSection = document.getElementById('postSection');
        const postContent = document.getElementById('postContent').querySelector('div');
        const postHashtags = document.getElementById('postHashtags');
        
        postContent.textContent = post.content;
        
        postHashtags.innerHTML = '';
        post.hashtags.forEach(tag => {
            const hashtagElement = document.createElement('span');
            hashtagElement.className = 'inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded';
            hashtagElement.textContent = `#${tag}`;
            postHashtags.appendChild(hashtagElement);
        });
        
        postSection.classList.remove('hidden');
    }

    async copyToClipboard() {
        const postContent = document.getElementById('postContent').querySelector('div').textContent;
        const hashtags = Array.from(document.querySelectorAll('#postHashtags span'))
            .map(span => span.textContent)
            .join(' ');
        
        const fullPost = `${postContent}\n\n${hashtags}`;
        
        try {
            await navigator.clipboard.writeText(fullPost);
            
            const copyBtn = document.getElementById('copyBtn');
            const originalContent = copyBtn.innerHTML;
            
            copyBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4 text-green-600"></i> تم النسخ';
            copyBtn.className = 'bg-green-50 border-green-200 text-green-700 py-2 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors';
            
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
                copyBtn.className = 'bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors';
                lucide.createIcons();
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy:', err);
            this.showError('فشل في نسخ المحتوى');
        }
    }

    showError(message) {
        const errorSection = document.getElementById('errorSection');
        const errorMessage = document.getElementById('errorMessage');
        
        errorMessage.textContent = message;
        errorSection.classList.remove('hidden');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }

    hideError() {
        document.getElementById('errorSection').classList.add('hidden');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LinkedInGenerator();
});
