document.addEventListener("DOMContentLoaded", () => {
    const indexLinks = document.querySelectorAll("#index a");
    const sections = document.querySelectorAll("#content section");
    const navbarHeight = 100; // Offset for the navbar height
    
    let lastHighlightedIndex = -1; // Keeps track of the last highlighted section index
    let isScrollingManually = false; // Flag to indicate manual scrolling through clicks
  
    // Function to get the cumulative height of sections
    const getCumulativeHeight = () => {
        let cumulativeHeight = 0;
        const sectionHeights = [];
        sections.forEach(section => {
            cumulativeHeight += section.offsetHeight;
            sectionHeights.push(cumulativeHeight);
        });
        return sectionHeights;
    };
  
    // Function to highlight the active section in the index
    const highlightSections = () => {
        if (isScrollingManually) return; // Skip highlighting if scrolling manually
  
        const cumulativeHeights = getCumulativeHeight();
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        let sectionHighlighted = false;
  
        sections.forEach((section, index) => {
            const indexLink = document.querySelector(`#index a[href="#${section.id}"]`);
            if (
                scrollPosition >= cumulativeHeights[index] - section.offsetHeight / 2 &&
                scrollPosition < cumulativeHeights[index]
            ) {
                if (lastHighlightedIndex !== index) {
                    indexLink.classList.add("active");
                    if (lastHighlightedIndex !== -1) {
                        const lastIndexLink = document.querySelector(`#index a[href="#${sections[lastHighlightedIndex].id}"]`);
                        lastIndexLink.classList.remove("active");
                    }
                    lastHighlightedIndex = index;
                }
                sectionHighlighted = true;
            }
        });
  
        if (!sectionHighlighted && lastHighlightedIndex !== -1) {
            const lastIndexLink = document.querySelector(`#index a[href="#${sections[lastHighlightedIndex].id}"]`);
            lastIndexLink.classList.add("active");
        }
    };
  
    // Smooth scrolling to section when clicking an index link
    indexLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            isScrollingManually = true; // Set flag to ignore scroll highlighting
  
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);
  
            const yOffset = -navbarHeight; // Offset for navbar
            const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
            window.scrollTo({ top: y, behavior: "smooth" });
  
            // Highlight clicked section
            indexLinks.forEach(link => link.classList.remove("active"));
            link.classList.add("active");
            lastHighlightedIndex = Array.from(sections).indexOf(targetSection);
  
            // Resume scroll-based highlighting after animation
            setTimeout(() => {
                isScrollingManually = false;
            }, 1000); // Adjust timeout based on animation duration
        });
    });
  
    // Initial highlight on page load
    highlightSections();
  
    // Update highlights on scroll
    window.addEventListener("scroll", highlightSections);
  });