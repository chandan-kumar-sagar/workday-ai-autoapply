const scanner = {
  scanFormFields: () => {
    console.log('Scanning for Workday form fields...');
    const fields = document.querySelectorAll('input, select, textarea');
    return Array.from(fields).map(f => {
      const label = f.labels?.[0]?.innerText || 
                    f.closest('.css-1234')?.querySelector('label')?.innerText || // Workday specific classes might be needed
                    f.placeholder || 
                    f.getAttribute('aria-label') || '';
      
      return {
        id: f.id,
        name: f.name,
        label: label.trim(),
        type: f.type,
        element: f
      };
    });
  }
};
