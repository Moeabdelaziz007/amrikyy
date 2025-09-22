import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';

function createDigitalIdCard() {
    const digitalIdCardRoot = document.getElementById('digital-id-card-root');
    if (!digitalIdCardRoot) {
        return;
    }

    let storedUserId = localStorage.getItem('aura-user-id');
    if (!storedUserId) {
        storedUserId = uuidv4();
        localStorage.setItem('aura-user-id', storedUserId);
    }
    const userId = storedUserId;
    const userName = 'Guest User';

    QRCode.toDataURL(userId, {
        width: 200,
        margin: 2,
        color: {
            dark: '#00E5FF',
            light: '#00000000'
        }
    })
        .then(url => {
            const cardHTML = `
                <div class="digital-id-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="fas fa-id-card"></i>
                            AuraOS Digital ID
                        </h3>
                    </div>
                    <div class="card-content">
                        <div class="id-details">
                            <h4>${userName}</h4>
                            <p class="uuid">ID: ${userId}</p>
                        </div>
                        <div class="qr-code">
                            <img src="${url}" alt="QR Code" />
                        </div>
                    </div>
                    <div class="card-footer">
                        <p>Scan to verify</p>
                    </div>
                </div>
            `;
            digitalIdCardRoot.innerHTML = cardHTML;
        })
        .catch(err => {
            console.error(err);
        });
}

createDigitalIdCard();
