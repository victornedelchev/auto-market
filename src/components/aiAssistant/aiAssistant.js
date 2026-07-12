export function renderAiAssistant() {
    return `
        <!-- Floating Action Button -->
        <button type="button" class="btn btn-am-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center ai-assistant-btn" 
                data-bs-toggle="modal" data-bs-target="#aiAssistantModal"
                title="Ask AI Assistant">
            <i class="bi bi-robot fs-3"></i>
        </button>

        <!-- AI Assistant Modal -->
        <div class="modal fade" id="aiAssistantModal" tabindex="-1" aria-labelledby="aiAssistantModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content border-0 shadow-lg" style="border-radius: var(--am-radius-lg);">
                    <div class="modal-header bg-light border-bottom-0 pb-0 pt-4 px-4">
                        <h5 class="modal-title d-flex align-items-center fw-bold" id="aiAssistantModalLabel" style="font-family: var(--am-font-display);">
                            <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                                <i class="bi bi-robot fs-5"></i>
                            </div>
                            AI Assistant
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 pt-3">
                        <p class="text-muted mb-4">Hello! I'm here to help you navigate AutoMarket. Select a question below to learn more.</p>
                        
                        <div class="list-group mb-4 gap-2 border-0">
                            <button type="button" class="list-group-item list-group-item-action border rounded fw-medium ai-question-btn" data-question="1" style="transition: all 0.2s ease;">
                                <i class="bi bi-question-circle text-primary me-2"></i> How do I create listing?
                            </button>
                            <button type="button" class="list-group-item list-group-item-action border rounded fw-medium ai-question-btn" data-question="2" style="transition: all 0.2s ease;">
                                <i class="bi bi-question-circle text-primary me-2"></i> How do I upload images?
                            </button>
                            <button type="button" class="list-group-item list-group-item-action border rounded fw-medium ai-question-btn" data-question="3" style="transition: all 0.2s ease;">
                                <i class="bi bi-question-circle text-primary me-2"></i> How do Favorites work?
                            </button>
                            <button type="button" class="list-group-item list-group-item-action border rounded fw-medium ai-question-btn" data-question="4" style="transition: all 0.2s ease;">
                                <i class="bi bi-question-circle text-primary me-2"></i> How do I contact seller?
                            </button>
                        </div>

                        <!-- Answer Container -->
                        <div id="ai-answer-container" class="d-none bg-primary bg-opacity-10 rounded p-3 position-relative">
                            <i class="bi bi-stars text-primary position-absolute top-0 start-0 translate-middle ms-3 mt-1"></i>
                            <p id="ai-answer-text" class="mb-0 text-dark" style="font-size: 0.95rem; line-height: 1.6;"></p>
                        </div>
                    </div>
                    <div class="modal-footer border-top-0 pt-0 pb-4 px-4">
                        <button type="button" class="btn btn-am-outline w-100" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

export function initAiAssistant() {
    const buttons = document.querySelectorAll('.ai-question-btn');
    const answerContainer = document.getElementById('ai-answer-container');
    const answerText = document.getElementById('ai-answer-text');

    const answers = {
        '1': "To create a listing, you must first log in or register an account. Once logged in, click the 'Create Listing' button located in the navigation bar or on your profile page. You'll be taken to a form where you can enter the vehicle's details like brand, model, year, and price. Our AI tools can help extract specifications or write an engaging description for you. Finally, upload your photos and click 'Publish Listing'!",
        '2': "You can upload images when creating or editing a listing in the 'Photos' section. Simply drag and drop your image files into the designated dashed upload area, or click the 'Browse Files' button to select them from your device. You can upload a maximum of 10 images. Accepted formats are JPG, PNG, and WebP, with a size limit of 5MB per file. The first image you upload will automatically become the cover photo.",
        '3': "Favorites allow you to save car listings you are interested in for quick access later. To use this feature, you need to be logged into your account. Click the heart icon on any car card or on the detailed listing page to add it to your Favorites. You can view all your saved listings by clicking 'Favorites' in the main navigation menu. Click the heart icon again to remove a listing from your saved list.",
        '4': "To contact a seller, open the specific car listing you are interested in by clicking 'View Details'. On the listing details page, locate the 'Seller Information' card. Here, you'll see a primary 'Contact Seller' button. Clicking this button will automatically open your device's default email client, pre-filling an email addressed directly to the seller so you can securely ask questions or arrange a viewing."
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all
            buttons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                const icon = b.querySelector('i');
                if(icon) {
                    icon.classList.remove('text-white');
                    icon.classList.add('text-primary');
                }
            });

            // Add active class to clicked
            const clickedBtn = e.currentTarget;
            clickedBtn.classList.add('bg-primary', 'text-white', 'border-primary');
            const clickedIcon = clickedBtn.querySelector('i');
            if(clickedIcon) {
                clickedIcon.classList.remove('text-primary');
                clickedIcon.classList.add('text-white');
            }

            // Show answer
            const qId = clickedBtn.getAttribute('data-question');
            answerText.innerHTML = answers[qId];
            answerContainer.classList.remove('d-none');
            
            // Small animation
            answerContainer.style.opacity = 0;
            answerContainer.style.transform = 'translateY(10px)';
            setTimeout(() => {
                answerContainer.style.transition = 'all 0.3s ease';
                answerContainer.style.opacity = 1;
                answerContainer.style.transform = 'translateY(0)';
            }, 10);
        });
    });

    // Reset modal state when closed
    const modalEl = document.getElementById('aiAssistantModal');
    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', () => {
            // Hide the answer container
            answerContainer.classList.add('d-none');
            answerText.innerHTML = '';
            
            // Reset all buttons to default state
            buttons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'border-primary');
                const icon = b.querySelector('i');
                if(icon) {
                    icon.classList.remove('text-white');
                    icon.classList.add('text-primary');
                }
            });
        });
    }
}
