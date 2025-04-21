window.HELP_IMPROVE_VIDEOJS = false;
$(document).ready(function() {
  // Check for click events on the navbar burger icon
  var options = {
    slidesToScroll: 1,
    slidesToShow: 1,
    loop: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
  }
  
  // Initialize all div with carousel class
  var carousels = bulmaCarousel.attach('.carousel', options);
  bulmaSlider.attach();
  
  // Global variables for sorting
  let currentSortColumn = 20; // Default sort by overall average (last column)
  let currentSortDirection = 'desc'; // Default sort direction
  
  // Array of column indices to exclude from highlighting and average calculations
  // By default, no columns are excluded (empty array)
  let excludedColumns = [];
  
  // Function to sort the table
  function sortTable(columnIndex) {
    const table = document.getElementById('leaderboardTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Reset all sort icons
    const sortIcons = table.querySelectorAll('.sort-icon');
    sortIcons.forEach(icon => {
      icon.className = 'sort-icon';
    });
    
    // Update sort direction
    if (currentSortColumn === columnIndex) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortColumn = columnIndex;
      // Default asc for model name, params, quantization, and desc for scores
      currentSortDirection = (columnIndex <= 2) ? 'asc' : 'desc';
      // For resource columns (GPU and Disk), default to asc
      if (columnIndex >= 3 && columnIndex <= 4) {
        currentSortDirection = 'asc';
      }
    }
    
    // Update the sort icon for the current column
    const currentSortIcon = table.querySelector(`th:nth-child(${columnIndex + 1}) .sort-icon`);
    if (currentSortIcon) {
      currentSortIcon.classList.add(currentSortDirection === 'asc' ? 'sort-asc' : 'sort-desc');
    }
    
    // Sort the rows
    rows.sort((a, b) => {
      let aValue = a.querySelector(`td:nth-child(${columnIndex + 1})`).textContent;
      let bValue = b.querySelector(`td:nth-child(${columnIndex + 1})`).textContent;
      
      if (columnIndex <= 2) {
        // Sort by model name or param size or quantization (text)
        return currentSortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        // Sort by numeric values
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
        
        if (isNaN(aValue)) aValue = 0;
        if (isNaN(bValue)) bValue = 0;
        
        return currentSortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }
    });
    
    // Remove existing rows
    while (tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
    
    // Add sorted rows back to the table
    rows.forEach(row => {
      tbody.appendChild(row);
    });
    
    // Highlight the top scores
    highlightTopScores();
  }
  
  // Function to highlight top scores in each column
  function highlightTopScores() {
    const table = document.getElementById('leaderboardTable');
    const tbody = table.querySelector('tbody');
    
    // Skip the first 5 columns (model name, params, quantization, GPU memory, disk size)
    for (let col = 5; col <= 20; col++) {
      // Skip excluded columns
      if (excludedColumns.includes(col)) {
        continue;
      }
      
      let maxValue = -Infinity;
      let maxCells = [];
      
      // Find the maximum value in this column
      tbody.querySelectorAll(`td:nth-child(${col + 1})`).forEach(cell => {
        const value = parseFloat(cell.textContent);
        if (!isNaN(value)) {
          if (value > maxValue) {
            maxValue = value;
            maxCells = [cell];
          } else if (value === maxValue && value > 0) { // Only consider equal maximum if > 0
            maxCells.push(cell);
          }
        }
      });
      
      // Remove highlighting from all cells in this column
      tbody.querySelectorAll(`td:nth-child(${col + 1})`).forEach(cell => {
        cell.classList.remove('highlight-cell');
      });
      
      // Only highlight cells if max value is greater than 0
      if (maxValue > 0) {
        maxCells.forEach(cell => {
          cell.classList.add('highlight-cell');
        });
      }
    }
  }
  
  // Function to calculate and update average scores
  function updateAverageScores() {
    const table = document.getElementById('leaderboardTable');
    const tbody = table.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    
    rows.forEach(row => {
      // Calculate sorting average (columns 13-18, indices 13-18)
      let sortingSum = 0;
      let sortingCount = 0;
      
      // Calculate overall average (columns 5-18, indices 5-18)
      let overallSum = 0;
      let overallCount = 0;
      
      // Process each scoring column
      for (let col = 5; col <= 18; col++) {
        // Skip excluded columns
        if (excludedColumns.includes(col)) {
          continue;
        }
        
        const cell = row.querySelector(`td:nth-child(${col + 1})`);
        const value = parseFloat(cell.textContent);
        
        if (!isNaN(value)) {
          // Add to overall sum
          overallSum += value;
          overallCount++;
          
          // If this is a sorting column (13-18), add to sorting sum
          if (col >= 13 && col <= 18) {
            sortingSum += value;
            sortingCount++;
          }
        }
      }
      
      // Update sorting average (column 19)
      const sortingAvg = sortingCount > 0 ? sortingSum / sortingCount : 0;
      row.querySelector('td:nth-child(20)').textContent = sortingAvg.toFixed(2);
      
      // Update overall average (column 20)
      const overallAvg = overallCount > 0 ? overallSum / overallCount : 0;
      row.querySelector('td:nth-child(21)').textContent = overallAvg.toFixed(2);
    });
  }
  
  // Function to exclude or include a column
  window.toggleColumnExclusion = function(columnIndex) {
    const index = excludedColumns.indexOf(columnIndex);
    
    if (index === -1) {
      // Column is not excluded, so exclude it
      excludedColumns.push(columnIndex);
    } else {
      // Column is already excluded, so include it
      excludedColumns.splice(index, 1);
    }
    
    // Update averages and highlighting
    updateAverageScores();
    highlightTopScores();
  }
  
  // Function to search for models
  function searchModels() {
    const input = document.getElementById('searchInput');
    const filter = input.value.toUpperCase();
    const table = document.getElementById('leaderboardTable');
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
      const modelNameCell = row.querySelector('td:first-child');
      const quantCell = row.querySelector('td:nth-child(3)');
      
      const modelName = modelNameCell.textContent || modelNameCell.innerText;
      const quantType = quantCell.textContent || quantCell.innerText;
      
      if (modelName.toUpperCase().indexOf(filter) > -1 || 
          quantType.toUpperCase().indexOf(filter) > -1) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }
  
  // Attach the search function to the search input
  $('#searchInput').on('input', searchModels);
  $('#searchButton').on('click', searchModels);
  
  // Add sort icons to the table headers
  $('#leaderboardTable th').each(function(index) {
    $(this).append('<span class="sort-icon"></span>');
    $(this).css('cursor', 'pointer');
    
    // Add click event to header
    $(this).on('click', function() {
      sortTable(index);
    });
  });
  
  // Initialize the sort with the default column
  sortTable(currentSortColumn);
});