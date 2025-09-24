	document.addEventListener('DOMContentLoaded', function() {
			// Add hover effect to status card
			const statusCard = document.querySelector('.status-card');
			
			statusCard.addEventListener('mouseenter', function() {
				this.style.borderColor = 'rgba(52, 211, 153, 0.4)';
				this.style.boxShadow = '0 8px 32px rgba(52, 211, 153, 0.1)';
			});
			
			statusCard.addEventListener('mouseleave', function() {
				this.style.borderColor = 'rgba(63, 63, 70, 0.5)';
				this.style.boxShadow = 'none';
			});
		});