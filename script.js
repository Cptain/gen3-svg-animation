let isExploded = false;
let highlightedPartId = null; // Track which part is currently highlighted

// Part information database
const partInfo = {
  'gen3_brackets-back_top-side': {
    title: 'Top Back Brackets',
    description: 'Structural support brackets for top ceiling assembly mounting.'
  },
  'gen3_brackets-front_top-side': {
    title: 'Top Front Brackets',
    description: 'Front-facing structural brackets supporting the top pod ceiling.'
  },
  'gen3_brackets-back_bottom-side': {
    title: 'Bottom Back Brackets',
    description: 'Rear mounting brackets securing the bottom pod floor.'
  },
  'gen3_brackets-front_bottom-side': {
    title: 'Bottom Front Brackets',
    description: 'Front structural brackets for bottom pod floor support.'
  },
  'gen3_bottom-pod_floor': {
    title: 'Bottom Pod Floor',
    description: 'Main floor assembly providing base structural foundation.'
  },
  'gen3_bottom-pod_ceiling': {
    title: 'Bottom Pod Ceiling',
    description: 'Internal ceiling separating bottom and top pod compartments.'
  },
  'gen3_top-pod_ceiling': {
    title: 'Top Pod Ceiling',
    description: 'Upper ceiling assembly forming the top enclosure.'
  },
  'gen3_bottom-pod_left-panel-1': {
    title: 'Left Panel 1',
    description: 'Primary left side panel for bottom pod enclosure.'
  },
  'gen3_bottom-pod_left-panel-2': {
    title: 'Left Panel 2',
    description: 'Secondary left side panel providing additional coverage.'
  },
  'gen3_bottom-pod_right-panel-1': {
    title: 'Right Panel 1',
    description: 'Primary right side panel for bottom pod enclosure.'
  },
  'gen3_bottom-pod_right-panel-2': {
    title: 'Right Panel 2',
    description: 'Secondary right side panel providing additional coverage.'
  },
  'gen3_bottom-pod_door-left': {
    title: 'Left Access Door',
    description: 'Left side access door for bottom pod maintenance.'
  },
  'gen3_bottom-pod_door-right': {
    title: 'Right Access Door',
    description: 'Right side access door for bottom pod maintenance.'
  },
  'gen3_top-pod_left-panel': {
    title: 'Top Left Panel',
    description: 'Left side panel for top pod compartment enclosure.'
  },
  'gen3_top-pod_right-panel': {
    title: 'Top Right Panel',
    description: 'Right side panel for top pod compartment enclosure.'
  },
  'gen3_top-pod_back-panel': {
    title: 'Top Back Panel',
    description: 'Rear panel providing back enclosure for top pod.'
  },
  'gen3_louvers': {
    title: 'Ventilation Louvers',
    description: 'Adjustable louvers controlling airflow and ventilation patterns.'
  },
  'gen3_bottom-pod_shelves': {
    title: 'Storage Shelves',
    description: 'Internal shelving system for equipment and component storage.'
  },
  'gen3_busway': {
    title: 'Electrical Busway',
    description: 'Power distribution busway providing electrical connectivity throughout system.'
  },
  'gen3_bottom-pod_mesh': {
    title: 'Bottom Mesh Guard',
    description: 'Protective mesh screening for bottom pod ventilation.'
  },
  'gen3_top-pod_mesh': {
    title: 'Top Mesh Guard',
    description: 'Protective mesh screening for top pod ventilation.'
  },
  'gen3_bottom-pod_mesh-overlay': {
    title: 'Bottom Mesh Guard',
    description: 'Interactive overlay for bottom pod mesh screening.'
  },
  'gen3_top-pod_mesh-overlay': {
    title: 'Top Mesh Guard',
    description: 'Interactive overlay for top pod mesh screening.'
  },
  'gen3_fans': {
    title: 'Cooling Fans',
    description: 'High-efficiency fans providing active cooling and air circulation.'
  },
  'gen3_fan-1': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-2': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-3': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-4': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-5': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-6': {
    title: 'Centrifugal Cooling Fan',
    description: 'Individual high-efficiency fan providing active cooling and air circulation.'
  },
  'gen3_fan-1-base': {
    title: 'Fan 1 Base Structure',
    description: 'Structural base component for fan unit 1 mounting and support.'
  },
  'gen3_fan-2-base': {
    title: 'Fan 2 Base Structure',
    description: 'Structural base component for fan unit 2 mounting and support.'
  },
  'gen3_fan-3-base': {
    title: 'Fan 3 Base Structure',
    description: 'Structural base component for fan unit 3 mounting and support.'
  },
  'gen3_fan-4-base': {
    title: 'Fan 4 Base Structure',
    description: 'Structural base component for fan unit 4 mounting and support.'
  },
  'gen3_fan-5-base': {
    title: 'Fan 5 Base Structure',
    description: 'Structural base component for fan unit 5 mounting and support.'
  },
  'gen3_fan-6-base': {
    title: 'Fan 6 Base Structure',
    description: 'Structural base component for fan unit 6 mounting and support.'
  },
  'gen3_bottom-pod_awnings': {
    title: 'Bottom Awnings',
    description: 'Weather protection awnings for bottom pod exterior.'
  },
  'gen3_top-pod_awnings': {
    title: 'Top Awnings',
    description: 'Weather protection awnings for top pod exterior.'
  }
};

function toggleExplodedView() {
  const svg = document.getElementById('main-svg');
  const button = document.querySelector('.toggle-btn');
  const gen3Parts = document.querySelectorAll('.gen3-part');
  
  if (isExploded) {
    svg.classList.remove('exploded');
    button.textContent = 'Toggle Exploded View';
    isExploded = false;
    
    // Get the current fan toggle state
    const checkbox = document.getElementById('fans-toggle');
    const areFansVisible = checkbox ? checkbox.checked : true;
    
    // Fan IDs that should respect the toggle state
    const fanIds = [
      'gen3_fan-1',
      'gen3_fan-2',
      'gen3_fan-3',
      'gen3_fan-4',
      'gen3_fan-5',
      'gen3_fan-6'
    ];
    
    // Reset all part opacities when exiting exploded view
    gen3Parts.forEach(part => {
      // Skip the parent gen3_fans group to avoid conflicts
      if (part.id === 'gen3_fans') {
        return;
      }
      
      // For fan elements, respect the toggle state
      if (fanIds.includes(part.id)) {
        if (areFansVisible) {
          part.style.setProperty('opacity', '1', 'important');
        } else {
          part.style.setProperty('opacity', '0', 'important');
        }
      } else {
        part.style.opacity = '';
      }
      
      part.style.filter = '';
    });
    
    // Clear highlight tracking
    highlightedPartId = null;
    
    // Hide popup when exiting exploded view
    hidePartPopup();
  } else {
    svg.classList.add('exploded');
    button.textContent = 'Reset View';
    isExploded = true;
    
    // Apply fan toggle state when entering exploded view
    // Use setTimeout to ensure this runs after the CSS class change
    setTimeout(() => {
      const checkbox = document.getElementById('fans-toggle');
      const areFansVisible = checkbox ? checkbox.checked : true;
      
      const fanIds = [
        'gen3_fan-1',
        'gen3_fan-2',
        'gen3_fan-3',
        'gen3_fan-4',
        'gen3_fan-5',
        'gen3_fan-6'
      ];
      
      fanIds.forEach(fanId => {
        const fanElement = document.getElementById(fanId);
        if (fanElement) {
          if (areFansVisible) {
            fanElement.style.setProperty('opacity', '1', 'important');
          } else {
            fanElement.style.setProperty('opacity', '0', 'important');
          }
        }
      });
    }, 50);
  }
}

// Add hover effects for individual parts when exploded
document.addEventListener('DOMContentLoaded', function() {
  const gen3Parts = document.querySelectorAll('.gen3-part');
  const meshOverlays = document.querySelectorAll('.mesh-overlay');
  
  // Create a mapping between overlay IDs and their corresponding mesh element IDs
  const overlayToMeshMap = {
    'gen3_bottom-pod_mesh-overlay': 'gen3_bottom-pod_mesh',
    'gen3_top-pod_mesh-overlay': 'gen3_top-pod_mesh'
  };
  
  gen3Parts.forEach(part => {
    // Check if this is a mesh overlay
    const isMeshOverlay = part.classList.contains('mesh-overlay');
    
    part.addEventListener('mouseenter', function(event) {
      console.log('Mouse enter on:', part.id, 'isMeshOverlay:', isMeshOverlay);
      if (isExploded) {
        // If it's a mesh overlay, apply effects to both the overlay and the corresponding mesh
        if (isMeshOverlay) {
          console.log('Processing mesh overlay hover:', part.id);
          const meshId = overlayToMeshMap[this.id];
          const meshElement = document.getElementById(meshId);
          
          // Apply effects to the actual mesh element
          if (meshElement) {
            meshElement.style.filter = 'brightness(1.1) drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
            
            // If in highlight mode and this part is faded, temporarily bring it back to full opacity
            if (meshElement.style.opacity === '0.1') {
              meshElement.style.opacity = '1';
            }
          }
          
          // Show popup with part information for the mesh, not the overlay
          showPartPopup(meshId, event);
        } else {
          // Normal behavior for non-overlay parts
          this.style.filter = 'brightness(1.1) drop-shadow(2px 2px 4px rgba(0,0,0,0.3))';
          this.style.cursor = 'pointer';
          
          // If in highlight mode and this part is faded, temporarily bring it back to full opacity
          if (this.style.opacity === '0.1') {
            this.style.opacity = '1';
          }
          
          // Show popup with part information
          showPartPopup(this.id, event);
        }
      }
    });
    
    part.addEventListener('mouseleave', function() {
      // If it's a mesh overlay, apply effects to both the overlay and the corresponding mesh
      if (isMeshOverlay) {
        const meshId = overlayToMeshMap[this.id];
        const meshElement = document.getElementById(meshId);
        
        // Reset effects on the actual mesh element
        if (meshElement) {
          meshElement.style.filter = '';
        }
        
        // Hide popup
        hidePartPopup();
        
        // If we have a highlighted part and this mesh was temporarily shown during hover,
        // restore it to the correct state based on whether it's the highlighted part
        if (highlightedPartId && meshElement) {
          if (meshId === highlightedPartId) {
            // This is the highlighted part, keep it at opacity 1
            meshElement.style.opacity = '1';
          } else {
            // This is not the highlighted part, fade it
            meshElement.style.opacity = '0.1';
          }
        }
      } else {
        // Normal behavior for non-overlay parts
        this.style.filter = '';
        this.style.cursor = '';
        
        // Hide popup
        hidePartPopup();
        
        // If we have a highlighted part and this part was temporarily shown during hover,
        // restore it to the correct state based on whether it's the highlighted part
        if (highlightedPartId) {
          if (this.id === highlightedPartId) {
            // This is the highlighted part, keep it at opacity 1
            this.style.opacity = '1';
          } else {
            // This is not the highlighted part, fade it
            this.style.opacity = '0.1';
          }
        }
      }
    });
    
    part.addEventListener('mousemove', function(event) {
      if (isExploded) {
        // Update popup position as mouse moves
        updatePopupPosition(event);
      }
    });
    
    // Add click event to highlight individual parts
    part.addEventListener('click', function(event) {
      console.log('Click detected on:', part.id, 'isMeshOverlay:', isMeshOverlay);
      if (isExploded) {
        // Prevent event bubbling to document
        event.stopPropagation();
        
        let targetElement = this;
        let targetId = this.id;
        
        console.log('Clicked on element:', targetId); // Debug log
        
        // If it's a mesh overlay, get the corresponding mesh element
        if (isMeshOverlay) {
          console.log('Processing mesh overlay click:', part.id);
          const meshId = overlayToMeshMap[this.id];
          targetElement = document.getElementById(meshId);
          targetId = meshId;
          if (!targetElement) return;
        }
        
        // Check if this specific part is already highlighted
        if (highlightedPartId === targetId) {
          // Same part clicked again - remove all highlighting
          gen3Parts.forEach(p => {
            // Skip the parent gen3_fans group to avoid conflicts
            if (p.id === 'gen3_fans') {
              return;
            }
            p.style.opacity = '';
            p.style.filter = '';
          });
          highlightedPartId = null;
          console.log('Cleared highlighting'); // Debug log
        } else {
          // Different part clicked or first click - highlight this part and fade others
          gen3Parts.forEach(p => {
            // Skip the parent gen3_fans group to avoid conflicts
            if (p.id === 'gen3_fans') {
              return;
            }
            
            if (p.classList.contains('mesh-overlay')) {
              // For mesh overlays, set opacity to match their corresponding mesh
              const overlayMeshId = overlayToMeshMap[p.id];
              if (overlayMeshId === targetId) {
                p.style.opacity = '1';
                p.style.filter = 'brightness(1.2) drop-shadow(2px 2px 6px rgba(30, 117, 223, 0.8))';
              } else {
                p.style.opacity = '0.1';
                p.style.filter = '';
              }
            } else {
              // For regular parts
              if (p.id === targetId) {
                p.style.opacity = '1';
                p.style.filter = 'brightness(1.2) drop-shadow(2px 2px 6px rgba(30, 117, 223, 0.8))';
                console.log('Highlighted element:', p.id); // Debug log
              } else {
                p.style.opacity = '0.1';
                p.style.filter = '';
              }
            }
          });
          highlightedPartId = targetId;
        }
      }
    });
  });
  
  // Add click listener to document to clear highlights when clicking elsewhere
  document.addEventListener('click', function(event) {
    if (isExploded) {
      // Check if the click was not on a gen3 part
      const isGen3Part = event.target.closest('.gen3-part');
      if (!isGen3Part) {
        // Clear all highlights
        gen3Parts.forEach(p => {
          // Skip the parent gen3_fans group to avoid conflicts
          if (p.id === 'gen3_fans') {
            return;
          }
          p.style.opacity = '';
          p.style.filter = '';
        });
        highlightedPartId = null;
      }
    }
  });
});

// Function to show part popup
function showPartPopup(partId, event) {
  const info = partInfo[partId];
  const popupElement = document.getElementById('part-popup');
  const titleElement = document.getElementById('popup-title');
  const descriptionElement = document.getElementById('popup-description');
  
  if (info) {
    titleElement.textContent = info.title;
    descriptionElement.textContent = info.description;
    popupElement.classList.add('visible');
    updatePopupPosition(event);
  }
}

// Function to hide part popup
function hidePartPopup() {
  const popupElement = document.getElementById('part-popup');
  popupElement.classList.remove('visible');
}

// Function to update popup position
function updatePopupPosition(event) {
  const popupElement = document.getElementById('part-popup');
  const offsetX = 10;
  const offsetY = -10;
  
  // Position popup above and slightly to the right of cursor
  let x = event.pageX + offsetX;
  let y = event.pageY + offsetY - popupElement.offsetHeight;
  
  // Keep popup within viewport bounds
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollTop = window.pageYOffset;
  const scrollLeft = window.pageXOffset;
  
  // Adjust horizontal position if popup would go off screen
  if (x + popupElement.offsetWidth > viewportWidth + scrollLeft) {
    x = event.pageX - popupElement.offsetWidth - offsetX;
  }
  
  // Adjust vertical position if popup would go off screen
  if (y < scrollTop) {
    y = event.pageY + offsetY + 20; // Show below cursor instead
  }
  
  popupElement.style.left = x + 'px';
  popupElement.style.top = y + 'px';
}

// Function to toggle fans visibility
function toggleFans() {
  const checkbox = document.getElementById('fans-toggle');
  const isVisible = checkbox.checked;
  
  // Fan IDs to toggle
  const fanIds = [
    'gen3_fan-1',
    'gen3_fan-2',
    'gen3_fan-3',
    'gen3_fan-4',
    'gen3_fan-5',
    'gen3_fan-6'
  ];
  
  fanIds.forEach(fanId => {
    const fanElement = document.getElementById(fanId);
    if (fanElement) {
      if (isVisible) {
        fanElement.style.setProperty('opacity', '1', 'important');
      } else {
        fanElement.style.setProperty('opacity', '0', 'important');
      }
    }
  });
}