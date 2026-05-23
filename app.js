/**
 * Snatch VC Demo Prototype - Main Interaction Script
 * Author: Senior Frontend Engineer & UI/UX Director
 * Purpose: Handles synchronization between Campaign Studio SaaS dashboard and iOS mobile app simulator.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const state = {
    campaign: {
      active: false,
      title: 'Nike Air Mag RTFKT Drop',
      radius: 250,
      rewardName: 'Nike Air Mag (RTFKT Edition)',
      rewardVal: 'Legendary Sneaker Drop',
    },
    player: {
      level: 12,
      xp: 7150,
      xpNext: 10000,
      abilityPoints: 1250,
      scanRange: 250,
      totalSnatches: 128,
      rewardsClaimed: 1248,
      streak: 12,
      wallet: [
        {
          id: 'mythic-cash',
          val: '$10,000',
          title: 'Mythic Cash Vault',
          desc: 'Golden District Jackpot. Claimed!',
          tag: 'MYTHIC',
        },
        {
          id: 'sneaker-drop',
          val: '$1,200',
          title: 'Nike Air Mag',
          desc: 'RTFKT x Nike Collaboration. Verified Claim.',
          tag: 'LEGENDARY',
        },
        {
          id: 'mystery-crate',
          val: '$150',
          title: 'Epic Mystery Crate',
          desc: 'NYC Scavenger Hunt Drop. Code active.',
          tag: 'EPIC',
        },
      ],
    },
    activeTab: 'hunts', // hunts, wallet, leaderboard, profile
  };

  // ==========================================
  // 2. DOM CACHING & SELECTORS
  // ==========================================

  // Dashboard Navigator Panels (Left)
  const navWorkspaceItems = document.querySelectorAll('#workspace-navigator .demo-nav-item');
  const viewSections = document.querySelectorAll('#workspace-views .workspace-view');
  const startDemoBtn = document.getElementById('start-demo-btn');

  // Campaign Studio Elements
  const campaignTitleInput = document.getElementById('campaign-title-input');
  const campaignLocationInput = document.getElementById('campaign-location-input');
  const campaignRadiusSlider = document.getElementById('campaign-radius-slider');
  const campaignRadiusVal = document.getElementById('campaign-radius-val');
  const launchCampaignBtn = document.getElementById('launch-campaign-btn');
  const rewardSelectCards = document.querySelectorAll('.reward-select-card');
  const previewSvgWrapper = document.querySelector('.holo-visual-container .holo-svg-wrapper');
  const phoneSvgWrapper = document.querySelector('#phone-screen-discover .holo-svg-wrapper');
  const approachSvgWrapper = document.querySelector('#approach-holo-container .holo-svg-wrapper');

  // Campaign Studio Visual Sync
  const studioGeofenceCircle = document.getElementById('studio-geofence-circle');
  const mapGeofenceRadiusText = document.getElementById('map-geofence-radius-text');
  const rewardPreviewMainTitle = document.getElementById('reward-preview-main-title');
  const rewardNamePreview = document.getElementById('reward-name-preview');

  // Drops Database Table Sync
  const tableCellTitle = document.getElementById('table-cell-title');
  const tableCellRadius = document.getElementById('table-cell-radius');
  const tableCellStatus = document.getElementById('table-cell-status');

  // Phone Simulator - Overall Components
  const phoneCameraFlash = document.getElementById('phone-camera-flash');
  const phoneTabButtons = document.querySelectorAll('#phone-app-navigation .iphone-tab-item');
  const phoneViews = document.querySelectorAll('.iphone-simulator .iphone-view');

  // Phone - Discover Screen
  const discoverUnlaunchedMsg = document.getElementById('discover-unlaunched-message');
  const discoverShutterRow = document.getElementById('discover-shutter-row');
  const discoverRadarPreview = document.getElementById('discover-radar-preview');
  const discoverHoloItemBox = document.getElementById('discover-holo-item-box');
  const discoverShoeSvg = document.getElementById('discover-shoe-svg');
  const discoverShutterTrigger = document.getElementById('discover-shutter-trigger');
  const discoverWalletBtn = document.getElementById('discover-wallet-btn');
  const phoneDiscoverProfileBtn = document.getElementById('phone-discover-profile-btn');
  const phoneQuickHuntTrigger = document.getElementById('phone-quick-hunt-trigger');

  // Phone - Approach Screen
  const approachCloseBtn = document.getElementById('approach-close-btn');
  const approachProximityText = document.getElementById('approach-proximity-text');
  const approachProximitySlider = document.getElementById('approach-proximity-slider');
  const approachGiftboxSvg = document.getElementById('approach-giftbox-svg');
  const approachSnatchTrigger = document.getElementById('approach-snatch-trigger');

  // Phone - Snatched Success Modal
  const phoneModalSnatched = document.getElementById('phone-modal-snatched');
  const successRewardVal = document.getElementById('success-reward-val');
  const successRewardTitle = document.getElementById('success-reward-title');
  const successRewardSub = document.getElementById('success-reward-sub');
  const successWalletBtn = document.getElementById('success-wallet-btn');
  const successHuntingBtn = document.getElementById('success-hunting-btn');
  const copyBtn = document.querySelector('.copy-btn');

  // Phone - Wallet Screen
  const walletCardNike = document.getElementById('wallet-card-nike');
  const walletCountBadge = document.getElementById('wallet-count-badge');
  const walletNikeTitle = document.getElementById('wallet-nike-title');
  const walletNikeValue = document.getElementById('wallet-nike-value');
  const walletNikeTag = document.getElementById('wallet-nike-tag');

  // Phone - Quick Hunt Create -> Place -> Invite -> Player Loop
  const qhCreateBackBtn = document.getElementById('qh-create-back-btn');
  const qhBtnCreateHunt = document.getElementById('qh-btn-create-hunt');
  const qhPlaceBackBtn = document.getElementById('qh-place-back-btn');
  const qhBtnConfirmLocation = document.getElementById('qh-btn-confirm-location');
  const qhInviteBackBtn = document.getElementById('qh-invite-back-btn');
  const qhBtnStartPlayerHunt = document.getElementById('qh-btn-start-player-hunt');
  const qhPlayerBackBtn = document.getElementById('qh-player-back-btn');
  const qhPlayerProximitySlider = document.getElementById('qh-player-proximity-slider');
  const qhPlayerProximityText = document.getElementById('qh-player-proximity-text');
  const qhBtnSnatchIt = document.getElementById('qh-btn-snatch-it');

  // Phone - Snatch Mode Profile & Abilities
  const profileEnterSmBtn = document.getElementById('profile-enter-sm-btn');
  const huntBackBtn = document.getElementById('hunt-back-btn');
  const huntShutterTrigger = document.getElementById('hunt-shutter-trigger');
  const abilitiesCloseBtn = document.getElementById('abilities-close-btn');
  const abilitiesUpgradeTrigger = document.getElementById('abilities-upgrade-trigger');
  const abilitiesPointsVal = document.getElementById('abilities-points-val');
  const abilityItemRange = document.getElementById('ability-item-range');
  const abilityRangeVal = document.getElementById('ability-range-val');

  // Phone - Leaderboard & Ambassador Toggles
  const leaderboardTabLocal = document.getElementById('leaderboard-tab-local');
  const leaderboardTabAmbassador = document.getElementById('leaderboard-tab-ambassador');
  const leaderboardLocalView = document.getElementById('leaderboard-local-view');
  const leaderboardAmbassadorView = document.getElementById('leaderboard-ambassador-view');
  const leaderboardAmbassadorLink = document.getElementById('leaderboard-ambassador-link');

  // ==========================================
  // 3. CORE UTILITIES (Transitions, Sync, Clock)
  // ==========================================

  // Live iOS Clock Simulation
  const updatePhoneTime = () => {
    const clockEl = document.getElementById('iphone-clock');
    if (!clockEl) return;
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clockEl.textContent = `${hours}:${minutes}`;
  };
  setInterval(updatePhoneTime, 1000);
  updatePhoneTime();

  // Unified Dashboard Workspace Panel Navigator (Left Side Switcher)
  let isScrollingFromNav = false;

  const syncPhoneToView = (viewName) => {
    switch (viewName) {
      case 'overview':
        // Show Hunts tab discover screen
        switchPhoneScreen('phone-screen-discover');
        highlightPhoneTab('tab-btn-hunts');
        break;
      case 'studio':
        // Show Hunts tab discover screen
        switchPhoneScreen('phone-screen-discover');
        highlightPhoneTab('tab-btn-hunts');
        break;
      case 'user-app':
        // If campaign is active, go directly to Approach screen, else Hunts discover
        if (state.campaign.active) {
          switchPhoneScreen('phone-screen-approach');
        } else {
          switchPhoneScreen('phone-screen-discover');
          highlightPhoneTab('tab-btn-hunts');
        }
        break;
      case 'quick-hunt':
        // Go straight to Quick Hunt creation flow
        switchPhoneScreen('phone-screen-qh-create');
        deactivatePhoneTabs();
        break;
      case 'snatch-mode':
        // Open the Profile screen
        switchPhoneScreen('phone-screen-profile');
        highlightPhoneTab('tab-btn-profile');
        break;
      case 'ambassadors':
        // Open the Leaderboard view and auto-toggle the Ambassador Sub-tab!
        switchPhoneScreen('phone-screen-leaderboard');
        highlightPhoneTab('tab-btn-leaderboard');
        toggleLeaderboardView('ambassador');
        break;
    }
  };

  const switchDashboardView = (viewName) => {
    // 1. Remove active state from all header tabs
    navWorkspaceItems.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      }
    });

    // 2. Smoothly scroll to the corresponding section
    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      isScrollingFromNav = true;
      targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Update active classes for visual transition effects
      viewSections.forEach((section) => {
        section.classList.remove('active');
      });
      targetSection.classList.add('active');

      setTimeout(() => {
        isScrollingFromNav = false;
      }, 1000);
    }

    // 3. Auto-sync Mobile Simulator Screen to corresponding view for visual storytelling
    syncPhoneToView(viewName);
  };

  // Wire up left Dashboard Header Navigator clicks
  navWorkspaceItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      switchDashboardView(targetView);
    });
  });

  // Set up ScrollSpy IntersectionObserver for stacked scroll views
  const observerOptions = {
    root: document.getElementById('workspace-views'),
    rootMargin: '-35% 0px -45% 0px', // Trigger focus when middle of section enters the screen
    threshold: 0.15,
  };

  const observerCallback = (entries) => {
    if (isScrollingFromNav) return;

    entries.forEach((entriesItem) => {
      if (entriesItem.isIntersecting) {
        const viewId = entriesItem.target.id;
        const viewName = viewId.replace('view-', '');

        // Sync header active tabs
        navWorkspaceItems.forEach((btn) => {
          if (btn.getAttribute('data-view') === viewName) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        // Set active class on view sections
        viewSections.forEach((section) => {
          if (section === entriesItem.target) {
            section.classList.add('active');
          } else {
            section.classList.remove('active');
          }
        });

        // Sync simulator view
        syncPhoneToView(viewName);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  viewSections.forEach((section) => {
    observer.observe(section);
  });

  // Start Demo Button on Overview Screen
  if (startDemoBtn) {
    startDemoBtn.addEventListener('click', () => {
      switchDashboardView('studio');
    });
  }

  // Simulator Screen Switcher
  const switchPhoneScreen = (screenId) => {
    phoneViews.forEach((view) => {
      view.classList.remove('active');
    });
    const targetView = document.getElementById(screenId);
    if (targetView) {
      targetView.classList.add('active');
    }
  };

  // Highlight Phone Bottom Navigation Tab
  const highlightPhoneTab = (tabId) => {
    phoneTabButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
    const targetBtn = document.getElementById(tabId);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }
  };

  // Deactivate all Phone Bottom Navigation Tabs (useful for sub-flows like Quick Hunt create)
  const deactivatePhoneTabs = () => {
    phoneTabButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
  };

  // Initialize Wallet Screen visibility based on state
  const initializeWalletUI = () => {
    if (walletCardNike) {
      // Hide Nike card initially
      walletCardNike.style.display = 'none';
      walletCardNike.classList.remove('active-item');
    }
    if (walletCountBadge) {
      walletCountBadge.textContent = '3';
    }
  };
  initializeWalletUI();

  // ==========================================
  // 4. CAMPAIGN STUDIO SYNC CONTROL
  // ==========================================

  // Live Sync: Title Input Field
  if (campaignTitleInput) {
    campaignTitleInput.addEventListener('input', (e) => {
      const val = e.target.value || 'Untitled Campaign';
      state.campaign.title = val;

      // Update UI components in dashboard and simulator
      if (rewardPreviewMainTitle) rewardPreviewMainTitle.textContent = val;
      if (rewardNamePreview) rewardNamePreview.textContent = val;
      if (tableCellTitle) tableCellTitle.textContent = val;

      // Update success modal values dynamically so they match!
      if (successRewardTitle) successRewardTitle.textContent = val;
      if (walletNikeTitle) walletNikeTitle.textContent = val;
    });
  }

  // Live Sync: Radius Range Slider
  if (campaignRadiusSlider) {
    campaignRadiusSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      state.campaign.radius = val;

      // Update radius text values
      if (campaignRadiusVal) campaignRadiusVal.textContent = `${val}m`;
      if (mapGeofenceRadiusText) mapGeofenceRadiusText.textContent = val;
      if (tableCellRadius) tableCellRadius.textContent = `${val}m`;

      // Scale SVG Geofence Circle on the Studio Soho Map (radius attribute)
      if (studioGeofenceCircle) {
        // Map slider values (100m - 500m) to SVG circle radius (30px - 140px)
        const svgRadius = 30 + ((val - 100) / 400) * 110;
        studioGeofenceCircle.setAttribute('r', svgRadius);
        const pulseRing = document.getElementById('studio-geofence-pulse-ring');
        if (pulseRing) {
          pulseRing.setAttribute('r', svgRadius);
        }
      }
    });
  }

  // Helper for telemetry countup with ease-out interpolation
  const animateCountUp = (element, start, end, duration) => {
    let startTime = null;
    const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const val = Math.floor(easedProgress * (end - start) + start);
      element.textContent = val.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  };

  // Campaign Launch Sync Event Trigger
  if (launchCampaignBtn) {
    launchCampaignBtn.addEventListener('click', () => {
      // 1. Immediately switch phone simulator to discover screen
      switchPhoneScreen('phone-screen-discover');
      highlightPhoneTab('tab-btn-hunts');

      // 2. Show the "Drop Broadcasting..." overlay on the phone simulator
      const broadcastingOverlay = document.getElementById('discover-broadcasting-overlay');
      const broadcastingDetails = document.getElementById('broadcasting-details');
      const locationVal = campaignLocationInput
        ? campaignLocationInput.value.split(',')[0]
        : 'SoHo';

      if (broadcastingOverlay) {
        broadcastingOverlay.style.display = 'flex';
      }
      if (broadcastingDetails) {
        broadcastingDetails.textContent = `Broadcasting to ${locationVal} Grid...`;
      }

      // 3. Activate the radar viewfinder sweep line animation on phone screen
      const cameraSweep = document.getElementById('discover-camera-sweep');
      if (cameraSweep) {
        cameraSweep.classList.add('active');
      }

      // 4. Flash the dashboard map to visualize placement signal launch
      const mapFrame = document.querySelector('.map-frame');
      if (mapFrame) {
        mapFrame.classList.remove('flash-active');
        mapFrame.offsetHeight; // Force reflow
        mapFrame.classList.add('flash-active');
      }

      const provisioningModal = document.getElementById('campaign-provisioning-modal');
      if (provisioningModal) {
        provisioningModal.classList.add('active');
      }

      const steps = [
        document.getElementById('prov-step-1'),
        document.getElementById('prov-step-2'),
        document.getElementById('prov-step-3'),
        document.getElementById('prov-step-4'),
      ];

      steps.forEach((step, idx) => {
        if (!step) return;
        const icon = step.querySelector('.prov-icon');
        if (idx === 0) {
          step.classList.add('active');
          if (icon) icon.className = 'prov-icon spinner';
        } else {
          step.classList.remove('active');
          if (icon) icon.className = 'prov-icon pending';
        }
      });

      const runStep = (idx) => {
        if (idx >= steps.length) {
          setTimeout(() => {
            if (provisioningModal) {
              provisioningModal.classList.remove('active');
            }

            // Hide the broadcasting overlay and sweep animation
            if (broadcastingOverlay) {
              broadcastingOverlay.style.display = 'none';
            }
            if (cameraSweep) {
              cameraSweep.classList.remove('active');
            }

            const pulseRing = document.getElementById('studio-geofence-pulse-ring');
            if (pulseRing) {
              pulseRing.classList.add('studio-geofence-pulse-ring-active');
            }

            // Play phone camera screen flash overlay
            if (phoneCameraFlash) {
              phoneCameraFlash.style.display = 'block';
              phoneCameraFlash.style.opacity = '1';
              setTimeout(() => {
                phoneCameraFlash.style.opacity = '0';
                setTimeout(() => {
                  phoneCameraFlash.style.display = 'none';
                }, 300);
              }, 150);
            }

            state.campaign.active = true;

            // Trigger Toast alert on mobile with the current active reward details
            const activeCard = document.querySelector('.reward-select-card.active');
            const rarity = activeCard ? activeCard.getAttribute('data-rarity') : 'legendary';
            const rName = activeCard
              ? activeCard.querySelector('.reward-select-name').textContent
              : 'Nike Air Mag';
            triggerSimulatorToast(
              `${rarity.toUpperCase()} DROP ACTIVE`,
              `Citywide ${rName} jackpot seeded in ${locationVal}.`,
              rarity
            );

            const badgeStatus = document.querySelector('.studio-title-heading .badge-status');
            if (badgeStatus) {
              badgeStatus.textContent = '• ACTIVE';
              badgeStatus.classList.remove('draft');
              badgeStatus.classList.add('active');
            }

            if (tableCellStatus) {
              tableCellStatus.textContent = 'ACTIVE';
              tableCellStatus.className = 'badge-status active';
            }

            if (discoverUnlaunchedMsg) discoverUnlaunchedMsg.style.display = 'none';
            if (discoverShutterRow) discoverShutterRow.style.display = 'flex';
            if (discoverRadarPreview) discoverRadarPreview.style.display = 'block';

            // Materialize the reward hologram sequentially
            const targetHolo3d = phoneSvgWrapper
              ? phoneSvgWrapper.querySelector('.holo-svg-container-3d')
              : null;
            if (targetHolo3d) {
              targetHolo3d.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
              targetHolo3d.style.opacity = '0';
              targetHolo3d.style.transform = 'scale(0.3) rotate(15deg)';
              targetHolo3d.offsetHeight; // Force reflow
              setTimeout(() => {
                targetHolo3d.style.opacity = '1.0';
                targetHolo3d.style.transform = 'scale(1.0) rotate(0deg)';
                targetHolo3d.classList.add('pulse-item');
              }, 50);
            } else if (discoverShoeSvg) {
              discoverShoeSvg.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
              discoverShoeSvg.style.opacity = '0';
              discoverShoeSvg.style.transform = 'scale(0.3) rotate(15deg)';
              discoverShoeSvg.offsetHeight; // Force reflow
              setTimeout(() => {
                discoverShoeSvg.style.opacity = '1.0';
                discoverShoeSvg.style.transform = 'scale(1.0) rotate(0deg)';
                discoverShoeSvg.classList.add('pulse-item');
              }, 50);
            }

            setTimeout(() => {
              switchDashboardView('user-app');
            }, 600);
          }, 600);
          return;
        }

        const prevStep = steps[idx - 1];
        if (prevStep) {
          const prevIcon = prevStep.querySelector('.prov-icon');
          if (prevIcon) prevIcon.className = 'prov-icon done';
        }

        const currentStep = steps[idx];
        if (currentStep) {
          currentStep.classList.add('active');
          const currentIcon = currentStep.querySelector('.prov-icon');
          if (currentIcon) currentIcon.className = 'prov-icon spinner';
        }

        if (idx === 2) {
          const telemetryBar = document.getElementById('studio-telemetry');
          if (telemetryBar) {
            telemetryBar.style.display = 'flex';
            telemetryBar.style.opacity = '0';
            telemetryBar.style.transition = 'opacity 0.5s ease';
            telemetryBar.offsetHeight;
            telemetryBar.style.opacity = '1';

            const huntersVal = document.getElementById('telemetry-hunters');
            const impressionsVal = document.getElementById('telemetry-impressions');
            const dropsVal = document.getElementById('telemetry-drops');

            if (huntersVal) animateCountUp(huntersVal, 0, 1248, 1500);
            if (impressionsVal) animateCountUp(impressionsVal, 0, 4820, 1500);
            if (dropsVal) {
              const targetDrops = Math.round(state.campaign.radius / 3.0);
              animateCountUp(dropsVal, 0, targetDrops, 1500);
            }
          }
        }

        setTimeout(() => {
          runStep(idx + 1);
        }, 800);
      };

      setTimeout(() => {
        runStep(1);
      }, 800);
    });
  }

  // ==========================================
  // 5. PHONE SIMULATOR NAVIGATION
  // ==========================================

  phoneTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Close success modal if active
      if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');

      const tabId = btn.id;
      highlightPhoneTab(tabId);

      // Determine target view screen
      switch (tabId) {
        case 'tab-btn-hunts':
          switchPhoneScreen('phone-screen-discover');
          break;
        case 'tab-btn-wallet':
          switchPhoneScreen('phone-screen-wallet');
          break;
        case 'tab-btn-leaderboard':
          switchPhoneScreen('phone-screen-leaderboard');
          toggleLeaderboardView('local');
          break;
        case 'tab-btn-profile':
          switchPhoneScreen('phone-screen-profile');
          break;
      }
    });
  });

  // Discover viewfinder profile avatar shortcut -> Profile Screen
  if (phoneDiscoverProfileBtn) {
    phoneDiscoverProfileBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-profile');
      highlightPhoneTab('tab-btn-profile');
    });
  }

  // 3D Mouse Parallax Tilt for iPhone Simulator
  const floatWrapper = document.querySelector('.iphone-float-wrapper');
  const simBody = document.querySelector('.iphone-simulator');

  if (floatWrapper && simBody) {
    floatWrapper.addEventListener('mousemove', (e) => {
      const rect = floatWrapper.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate rotation angles (max 12deg tilt)
      const rotateX = -(y / (rect.height / 2)) * 12;
      const rotateY = (x / (rect.width / 2)) * 12;

      // Calculate glare shift dynamically
      const glare = document.querySelector('.iphone-screen-glare');
      if (glare) {
        const glareX = (x / (rect.width / 2)) * 15;
        const glareY = (y / (rect.height / 2)) * 15;
        glare.style.transform = `translate(${glareX}px, ${glareY}px)`;
      }

      simBody.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      // Shift box shadow opposite to rotation for realistic depth
      const shadowX = -(x / (rect.width / 2)) * 25;
      const shadowY = -(y / (rect.height / 2)) * 25;
      simBody.style.boxShadow = `
        ${shadowX}px ${shadowY}px 35px rgba(0, 0, 0, 0.6),
        0 30px 60px rgba(168, 85, 247, 0.08),
        inset 0 0 12px rgba(255,255,255,0.05)
      `;
    });

    floatWrapper.addEventListener('mouseleave', () => {
      simBody.style.transform = 'rotateX(0deg) rotateY(0deg)';
      simBody.style.boxShadow = `
        0 15px 35px rgba(0, 0, 0, 0.6),
        0 30px 60px rgba(168, 85, 247, 0.08),
        inset 0 0 12px rgba(255,255,255,0.05)
      `;
      const glare = document.querySelector('.iphone-screen-glare');
      if (glare) {
        glare.style.transform = 'translate(0px, 0px)';
      }
    });
  }

  // Simulated Mobile Toast Alert Trigger
  const triggerSimulatorToast = (title, desc, rarity = 'epic') => {
    const toast = document.getElementById('sim-toast-alert');
    const toastTitle = document.getElementById('sim-toast-title');
    const toastDesc = document.getElementById('sim-toast-desc');
    if (!toast) return;

    // Apply colors/styles based on rarity
    let border = 'rgba(168, 85, 247, 0.3)';
    let bg = 'rgba(168, 85, 247, 0.1)';
    let stroke = 'var(--purple)';

    if (rarity === 'mythic') {
      border = 'rgba(239, 68, 68, 0.4)';
      bg = 'rgba(239, 68, 68, 0.15)';
      stroke = '#ef4444';
    } else if (rarity === 'legendary') {
      border = 'rgba(249, 115, 22, 0.4)';
      bg = 'rgba(249, 115, 22, 0.15)';
      stroke = '#f97316';
    }

    toast.style.setProperty('--border-color', border);
    toast.style.setProperty('--bg-color', bg);
    toast.style.setProperty('--stroke-color', stroke);

    if (toastTitle) toastTitle.textContent = title;
    if (toastDesc) toastDesc.textContent = desc;

    // Add active class to slide in
    toast.classList.add('active');

    // Auto close after 3.5s
    setTimeout(() => {
      toast.classList.remove('active');
    }, 3500);
  };

  // ==========================================
  // 6. SPONSORED HUNT PLAY FLOW
  // ==========================================

  // Unlocked Holographic Item Box Click -> Approach screen
  if (discoverHoloItemBox) {
    discoverHoloItemBox.addEventListener('click', () => {
      // Only proceed if campaign has been launched (unlocked)
      if (state.campaign.active) {
        resetApproachScreen();
        switchPhoneScreen('phone-screen-approach');
        deactivatePhoneTabs();
      }
    });
  }

  // Discovery Camera Shutter Button click -> Approach screen
  if (discoverShutterTrigger) {
    discoverShutterTrigger.addEventListener('click', () => {
      if (state.campaign.active) {
        resetApproachScreen();
        switchPhoneScreen('phone-screen-approach');
        deactivatePhoneTabs();
      }
    });
  }

  // Approach back button -> Discover viewfinder
  if (approachCloseBtn) {
    approachCloseBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-discover');
      highlightPhoneTab('tab-btn-hunts');
    });
  }

  // Discover viewfinder wallet button -> Wallet screen
  if (discoverWalletBtn) {
    discoverWalletBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-wallet');
      highlightPhoneTab('tab-btn-wallet');
    });
  }

  // Reset Approach screen elements to default state
  const resetApproachScreen = () => {
    if (approachProximitySlider) approachProximitySlider.value = 120;
    if (approachProximityText) approachProximityText.textContent = '120m';
    if (approachGiftboxSvg) {
      approachGiftboxSvg.style.transform = 'scale(0.5)';
      approachGiftboxSvg.style.opacity = '0.35';
    }
    updateApproachButton(120);
  };

  // Enable/Disable "SNATCH IT" button based on proximity slider value
  const updateApproachButton = (distance) => {
    if (!approachSnatchTrigger) return;
    if (distance <= 25) {
      approachSnatchTrigger.style.opacity = '1.0';
      approachSnatchTrigger.style.pointerEvents = 'auto';
      approachSnatchTrigger.style.boxShadow = '0 0 25px var(--lime-glow)';
      approachSnatchTrigger.style.background = 'var(--lime)';
      approachSnatchTrigger.style.color = 'var(--text-dark)';
      approachSnatchTrigger.textContent = 'SNATCH IT';
    } else {
      approachSnatchTrigger.style.opacity = '0.45';
      approachSnatchTrigger.style.pointerEvents = 'none';
      approachSnatchTrigger.style.boxShadow = 'none';
      approachSnatchTrigger.style.background = 'rgba(173, 255, 47, 0.1)';
      approachSnatchTrigger.style.color = 'var(--lime)';
      approachSnatchTrigger.textContent = 'GET WITHIN 25m';
    }
  };

  // Approach Proximity range slider changes
  if (approachProximitySlider) {
    approachProximitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (approachProximityText) approachProximityText.textContent = `${val}m`;

      // Scale holographic giftbox based on closeness to simulate AR walking approach
      if (approachGiftboxSvg) {
        const scale = Math.max(0.4, 1.4 - val / 130);
        const opacity = Math.max(0.3, 1.1 - val / 160);
        approachGiftboxSvg.style.transform = `scale(${scale})`;
        approachGiftboxSvg.style.opacity = opacity;
      }

      updateApproachButton(val);
    });
  }

  // Click SNATCH IT button -> Show Success Modal
  if (approachSnatchTrigger) {
    approachSnatchTrigger.addEventListener('click', () => {
      // Award 3000 XP and trigger progression visual sequence
      gainXP(3000);

      if (phoneModalSnatched) {
        // Find active reward card attributes to populate success details
        const activeCard = document.querySelector('.reward-select-card.active');
        const rName = activeCard
          ? activeCard.querySelector('.reward-select-name').textContent
          : state.campaign.title;
        const rVal = activeCard ? activeCard.getAttribute('data-val') : '$1,200';
        const rDesc = activeCard
          ? activeCard.getAttribute('data-desc')
          : 'RTFKT x Nike Collaboration. Verified Claim.';
        const rarity = activeCard ? activeCard.getAttribute('data-rarity') : 'legendary';

        if (successRewardTitle) successRewardTitle.textContent = rName;
        if (successRewardVal) successRewardVal.textContent = rVal;
        if (successRewardSub) successRewardSub.textContent = rDesc;

        const codeVal = document.querySelector('.modal-code-val');
        if (codeVal) {
          if (typeof matchingCodeForReward !== 'undefined') {
            codeVal.textContent = matchingCodeForReward(rName);
          } else {
            codeVal.textContent = 'MAG-RTFKT-99X';
          }
        }

        triggerSimulatorToast('ITEM SNATCHED!', `${rName} added to your wallet.`, rarity);

        phoneModalSnatched.classList.add('active');

        // Dynamically configure success wallet redirect for selected reward theme
        successWalletBtn.onclick = () => {
          if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');

          if (walletCardNike) {
            if (walletNikeTitle) walletNikeTitle.textContent = rName;
            if (walletNikeValue) walletNikeValue.textContent = rVal;
            if (walletNikeTag) {
              walletNikeTag.textContent = rarity.toUpperCase();
              walletNikeTag.className = `wallet-card-tag ${rarity}`;
            }

            walletCardNike.style.display = 'flex';
            walletCardNike.classList.add('active-item');
            setTimeout(() => {
              walletCardNike.classList.remove('active-item');
            }, 3000);
          }

          if (walletCountBadge) walletCountBadge.textContent = '4';

          switchPhoneScreen('phone-screen-wallet');
          highlightPhoneTab('tab-btn-wallet');
        };
      }
    });
  }

  // Clipboard Code Copy click
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const codeVal = document.querySelector('.modal-code-val');
      if (codeVal) {
        navigator.clipboard.writeText(codeVal.textContent).then(() => {
          const originalSvg = copyBtn.innerHTML;
          copyBtn.innerHTML =
            '<span style="font-size:0.6rem; color:var(--lime); font-weight:800;">COPIED!</span>';
          setTimeout(() => {
            copyBtn.innerHTML = originalSvg;
          }, 1500);
        });
      }
    });
  }

  // Success Modal -> VIEW IN WALLET button click
  if (successWalletBtn) {
    successWalletBtn.addEventListener('click', () => {
      // 1. Close Modal overlay
      if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');

      // 2. Add Nike reward card dynamically to Wallet screen
      if (walletCardNike) {
        // Configure reward details in card before displaying
        if (walletNikeTitle) walletNikeTitle.textContent = state.campaign.title;
        if (walletNikeValue) walletNikeValue.textContent = '$1,200';
        if (walletNikeTag) {
          walletNikeTag.textContent = 'LEGENDARY';
          walletNikeTag.className = 'wallet-card-tag legendary';
        }

        walletCardNike.style.display = 'flex';
        // Add animated glow highlight
        walletCardNike.classList.add('active-item');
      }

      // 3. Update Wallet claim counts
      if (walletCountBadge) walletCountBadge.textContent = '4';

      // 4. Switch phone views
      switchPhoneScreen('phone-screen-wallet');
      highlightPhoneTab('tab-btn-wallet');
    });
  }

  // Success Modal -> KEEP HUNTING button click
  if (successHuntingBtn) {
    successHuntingBtn.addEventListener('click', () => {
      if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');
      switchPhoneScreen('phone-screen-discover');
      highlightPhoneTab('tab-btn-hunts');
    });
  }

  // ==========================================
  // 7. QUICK HUNT SOCIAL FLOW
  // ==========================================

  // Shutter overlay lightning bolt click -> Quick Hunt screen
  if (phoneQuickHuntTrigger) {
    phoneQuickHuntTrigger.addEventListener('click', () => {
      switchDashboardView('quick-hunt');
      switchPhoneScreen('phone-screen-qh-create');
      deactivatePhoneTabs();
    });
  }

  // Q1: Create Quick Hunt Back -> Discover screen
  if (qhCreateBackBtn) {
    qhCreateBackBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-discover');
      highlightPhoneTab('tab-btn-hunts');
    });
  }

  // Q1: Create Quick Hunt button -> Place screen
  if (qhBtnCreateHunt) {
    qhBtnCreateHunt.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-qh-place');
    });
  }

  // Q2: Place screen back -> Create screen
  if (qhPlaceBackBtn) {
    qhPlaceBackBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-qh-create');
    });
  }

  // Q2: Confirm Location button -> Invite Crew lobby screen
  if (qhBtnConfirmLocation) {
    qhBtnConfirmLocation.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-qh-invite');
      triggerInviteLobbyFlow();
    });
  }

  // Q3: Invite Crew back -> Place screen
  if (qhInviteBackBtn) {
    qhInviteBackBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-qh-place');
    });
  }

  // Q3: Start Player Hunt button -> Player Hunt proximity tracking screen
  if (qhBtnStartPlayerHunt) {
    qhBtnStartPlayerHunt.addEventListener('click', () => {
      const countdownOverlay = document.getElementById('qh-countdown-overlay');
      const countdownNumber = document.getElementById('qh-countdown-number');
      if (countdownOverlay && countdownNumber) {
        countdownOverlay.classList.add('active');
        let count = 5;
        countdownNumber.textContent = count;
        const interval = setInterval(() => {
          count--;
          if (count > 0) {
            countdownNumber.textContent = count;
          } else {
            clearInterval(interval);
            countdownOverlay.classList.remove('active');
            if (qhPlayerProximitySlider) qhPlayerProximitySlider.value = 110;
            if (qhPlayerProximityText) qhPlayerProximityText.textContent = '110m';
            updateQHPlayerButton(110);
            switchPhoneScreen('phone-screen-qh-player');
          }
        }, 1000);
      } else {
        if (qhPlayerProximitySlider) qhPlayerProximitySlider.value = 110;
        if (qhPlayerProximityText) qhPlayerProximityText.textContent = '110m';
        updateQHPlayerButton(110);
        switchPhoneScreen('phone-screen-qh-player');
      }
    });
  }

  // Q4: Player Hunt back -> Invite crew screen
  if (qhPlayerBackBtn) {
    qhPlayerBackBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-qh-invite');
    });
  }

  // Quick Hunt Proximity range slider updates
  if (qhPlayerProximitySlider) {
    qhPlayerProximitySlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      if (qhPlayerProximityText) qhPlayerProximityText.textContent = `${val}m`;

      // Scale holographic Starbucks Cup based on closeness to simulate AR walking approach
      const qhCupSvg = document.getElementById('qh-cup-svg');
      if (qhCupSvg) {
        const scale = Math.max(0.4, 1.4 - val / 120);
        const opacity = Math.max(0.3, 1.1 - val / 150);
        qhCupSvg.style.transform = `scale(${scale})`;
        qhCupSvg.style.opacity = opacity;
      }

      updateQHPlayerButton(val);
    });
  }

  // Enable/Disable Quick Hunt "SNATCH IT" button based on proximity
  const updateQHPlayerButton = (distance) => {
    if (!qhBtnSnatchIt) return;
    if (distance <= 25) {
      qhBtnSnatchIt.style.opacity = '1.0';
      qhBtnSnatchIt.style.pointerEvents = 'auto';
      qhBtnSnatchIt.style.boxShadow = '0 0 25px var(--purple-glow)';
      qhBtnSnatchIt.textContent = 'SNATCH IT';
    } else {
      qhBtnSnatchIt.style.opacity = '0.45';
      qhBtnSnatchIt.style.pointerEvents = 'none';
      qhBtnSnatchIt.style.boxShadow = 'none';
      qhBtnSnatchIt.textContent = 'GET WITHIN 25m';
    }
  };

  // Quick Hunt player click SNATCH IT -> Show Success Modal with Starbucks details
  if (qhBtnSnatchIt) {
    qhBtnSnatchIt.addEventListener('click', () => {
      // Award 3000 XP
      gainXP(3000);

      if (phoneModalSnatched) {
        if (successRewardTitle) successRewardTitle.textContent = 'Epic Mystery Crate';
        if (successRewardVal) successRewardVal.textContent = '$150';
        if (successRewardSub) successRewardSub.textContent = 'NYC Mystery Crate Bounty';

        // Change code to Epic mock code
        const codeVal = document.querySelector('.modal-code-val');
        if (codeVal) codeVal.textContent = 'MYST-CRATE-99X';

        triggerSimulatorToast(
          'CRATE SNATCHED!',
          'Epic Mystery Crate added to your wallet.',
          'epic'
        );

        // Temporarily redefine the success wallet button callback for Epic card sync
        successWalletBtn.onclick = () => {
          if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');

          // Switch to Wallet and make sure Epic card displays epic tag highlight
          switchPhoneScreen('phone-screen-wallet');
          highlightPhoneTab('tab-btn-wallet');

          const epicCard = document.querySelector('.wallet-reward-card.epic-card');
          if (epicCard) {
            epicCard.classList.add('active-item');
            setTimeout(() => {
              epicCard.classList.remove('active-item');
            }, 3000);
          }
        };

        phoneModalSnatched.classList.add('active');
      }
    });
  }

  // ==========================================
  // 8. SNATCH MODE PROGRESSION & RADAR ACTIONS
  // ==========================================

  // Profile screen -> Click ENTER SNATCH MODE button -> Radar Hunt screen
  if (profileEnterSmBtn) {
    profileEnterSmBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-hunt');
      deactivatePhoneTabs();
    });
  }

  // Radar screen back button -> Profile screen
  if (huntBackBtn) {
    huntBackBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-profile');
      highlightPhoneTab('tab-btn-profile');
    });
  }

  // Radar screen click shutter trigger -> Simulate finding reward and gaining XP
  if (huntShutterTrigger) {
    huntShutterTrigger.addEventListener('click', () => {
      // Play a quick camera flash
      if (phoneCameraFlash) {
        phoneCameraFlash.style.display = 'block';
        phoneCameraFlash.style.opacity = '0.9';
        setTimeout(() => {
          phoneCameraFlash.style.opacity = '0';
          setTimeout(() => {
            phoneCameraFlash.style.display = 'none';
          }, 200);
        }, 100);
      }

      // Award +3000 XP and trigger level progression sequence
      gainXP(3000);

      // Back to profile screen after short delay if we didn't level up
      setTimeout(() => {
        const levelUpModal = document.getElementById('phone-modal-levelup');
        if (levelUpModal && !levelUpModal.classList.contains('active')) {
          switchPhoneScreen('phone-screen-profile');
          highlightPhoneTab('tab-btn-profile');
        }
      }, 700);
    });
  }

  // Click Scan Range Ability Box on Profile -> Abilities screen
  if (abilityItemRange) {
    abilityItemRange.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-abilities');
      deactivatePhoneTabs();
    });
  }

  // Profile points link/stats click -> Abilities screen
  const profileStatScanRangeBox = document.querySelector('.profile-stat-box:nth-child(4)');
  if (profileStatScanRangeBox) {
    profileStatScanRangeBox.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-abilities');
      deactivatePhoneTabs();
    });
  }

  // Profile Hunter Abilities shortcut card -> Abilities screen
  const profileAbilitiesCard = document.getElementById('profile-abilities-card');
  if (profileAbilitiesCard) {
    profileAbilitiesCard.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-abilities');
      deactivatePhoneTabs();
    });
  }

  // Abilities screen back button -> Profile screen
  if (abilitiesCloseBtn) {
    abilitiesCloseBtn.addEventListener('click', () => {
      switchPhoneScreen('phone-screen-profile');
      highlightPhoneTab('tab-btn-profile');
    });
  }

  // Abilities Screen -> Upgrade Button Trigger
  if (abilitiesUpgradeTrigger) {
    abilitiesUpgradeTrigger.addEventListener('click', () => {
      // Deduct Ability points if sufficient
      if (state.player.abilityPoints >= 250) {
        state.player.abilityPoints -= 250;
        state.player.scanRange = 500;
        state.player.totalSnatches += 2; // Simulated perk

        // Update Ability points indicators
        if (abilitiesPointsVal) {
          abilitiesPointsVal.textContent = state.player.abilityPoints.toLocaleString();
        }

        // Update Scan Range values in list
        const abilityItemRangeLevel = document.querySelector(
          '#ability-item-range .ability-item-level'
        );
        if (abilityItemRangeLevel) abilityItemRangeLevel.textContent = 'Level 4';

        if (abilityRangeVal) {
          abilityRangeVal.textContent = '500m';
          abilityRangeVal.style.color = 'var(--lime)';
        }

        // Synchronize back to profile stats view
        const profileStatRangeVal = document.querySelector(
          '.profile-stat-box:nth-child(4) .profile-stat-val'
        );
        if (profileStatRangeVal) profileStatRangeVal.textContent = '500m';

        // Synchronize to profile shortcut card view
        const profileAbilitiesPtsLabel = document.getElementById('profile-abilities-pts-label');
        if (profileAbilitiesPtsLabel) {
          profileAbilitiesPtsLabel.textContent = `${state.player.abilityPoints.toLocaleString()} AP available`;
        }
        const profileAbilitiesRangeLabel = document.getElementById('profile-abilities-range-label');
        if (profileAbilitiesRangeLabel) {
          profileAbilitiesRangeLabel.textContent = '500m';
        }

        // Display brief glowing visual verification
        abilitiesUpgradeTrigger.textContent = 'UPGRADED SUCCESS ✓';
        abilitiesUpgradeTrigger.style.background = 'var(--purple)';
        abilitiesUpgradeTrigger.style.color = '#FFFFFF';
        abilitiesUpgradeTrigger.style.boxShadow = '0 0 25px var(--purple-glow)';

        triggerRadarRipple();

        setTimeout(() => {
          abilitiesUpgradeTrigger.textContent = 'UPGRADE ABILITIES';
          abilitiesUpgradeTrigger.style.background = 'var(--lime)';
          abilitiesUpgradeTrigger.style.color = 'var(--text-dark)';
          abilitiesUpgradeTrigger.style.boxShadow = '0 4px 15px rgba(173, 255, 47, 0.3)';
        }, 2000);
      } else {
        // Inline button warning styling modifications to replace alert()
        const originalText = abilitiesUpgradeTrigger.textContent;
        const originalBg = abilitiesUpgradeTrigger.style.background;
        const originalColor = abilitiesUpgradeTrigger.style.color;
        const originalShadow = abilitiesUpgradeTrigger.style.boxShadow;

        abilitiesUpgradeTrigger.textContent = 'INSUFFICIENT AP';
        abilitiesUpgradeTrigger.style.background = '#ef4444';
        abilitiesUpgradeTrigger.style.color = '#ffffff';
        abilitiesUpgradeTrigger.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.6)';
        abilitiesUpgradeTrigger.style.pointerEvents = 'none';

        setTimeout(() => {
          abilitiesUpgradeTrigger.textContent = originalText;
          abilitiesUpgradeTrigger.style.background = originalBg;
          abilitiesUpgradeTrigger.style.color = originalColor;
          abilitiesUpgradeTrigger.style.boxShadow = originalShadow;
          abilitiesUpgradeTrigger.style.pointerEvents = 'auto';
        }, 2000);
      }
    });
  }

  // ==========================================
  // 9. LEADERBOARD TAB TOGGLES
  // ==========================================

  const toggleLeaderboardView = (subTab) => {
    if (subTab === 'ambassador') {
      leaderboardTabLocal.classList.remove('active');
      leaderboardTabAmbassador.classList.add('active');

      if (leaderboardLocalView) leaderboardLocalView.style.display = 'none';
      if (leaderboardAmbassadorView) leaderboardAmbassadorView.style.display = 'block';
    } else {
      leaderboardTabAmbassador.classList.remove('active');
      leaderboardTabLocal.classList.add('active');

      if (leaderboardAmbassadorView) leaderboardAmbassadorView.style.display = 'none';
      if (leaderboardLocalView) leaderboardLocalView.style.display = 'block';
    }
  };

  if (leaderboardTabLocal) {
    leaderboardTabLocal.addEventListener('click', () => toggleLeaderboardView('local'));
  }

  if (leaderboardTabAmbassador) {
    leaderboardTabAmbassador.addEventListener('click', () => toggleLeaderboardView('ambassador'));
  }

  // Ambassador Card link click -> Shifts left dashboard panel view
  if (leaderboardAmbassadorLink) {
    leaderboardAmbassadorLink.addEventListener('click', () => {
      switchDashboardView('ambassadors');
    });
  }

  // ==========================================
  // 10. PREMIUM INTERACTION SUBSYSTEMS & AUTO TOUR
  // ==========================================

  // Level Up Custom Modal Claim button event listener
  const levelupClaimBtn = document.getElementById('levelup-claim-btn');
  if (levelupClaimBtn) {
    levelupClaimBtn.addEventListener('click', () => {
      const levelUpModal = document.getElementById('phone-modal-levelup');
      if (levelUpModal) {
        levelUpModal.classList.remove('active');
      }

      state.player.abilityPoints += 250;
      if (abilitiesPointsVal) {
        abilitiesPointsVal.textContent = state.player.abilityPoints.toLocaleString();
      }

      const profileAbilitiesPtsLabel = document.getElementById('profile-abilities-pts-label');
      if (profileAbilitiesPtsLabel) {
        profileAbilitiesPtsLabel.textContent = `${state.player.abilityPoints.toLocaleString()} AP available`;
      }

      switchPhoneScreen('phone-screen-abilities');
      deactivatePhoneTabs();
      triggerRadarRipple();
    });
  }

  // Sonar radar ripple upgrade visual feedback
  const triggerRadarRipple = () => {
    const ripple = document.getElementById('phone-radar-ripple');
    if (ripple) {
      ripple.classList.remove('active');
      ripple.offsetHeight; // Force repaint
      ripple.classList.add('active');
      setTimeout(() => {
        ripple.classList.remove('active');
      }, 1500);
    }
  };

  // Quick Hunt lobby sequential joins simulation
  const triggerInviteLobbyFlow = () => {
    const qrCode = document.getElementById('qh-qr-code');
    if (qrCode) {
      qrCode.style.transform = 'scale(0.3)';
      qrCode.style.opacity = '0';
      qrCode.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        qrCode.style.transform = 'scale(1)';
        qrCode.style.opacity = '1';
      }, 50);
    }

    // Flicker/Animate Group Join Code
    const qhCodeSpan = document.querySelector(
      '#phone-screen-qh-invite span[style*="font-size: 1.1rem"]'
    );
    if (qhCodeSpan) {
      let flickerCount = 0;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      const flickerInterval = setInterval(() => {
        let tempCode = '';
        for (let i = 0; i < 6; i++) {
          tempCode += chars[Math.floor(Math.random() * chars.length)];
        }
        qhCodeSpan.textContent = tempCode;
        flickerCount++;
        if (flickerCount > 10) {
          clearInterval(flickerInterval);
          qhCodeSpan.textContent = 'NYC99X';
        }
      }, 80);
    }

    // Start TikTok-style streaming reaction emojis loop
    const emojis = ['🔥', '❤️', '🎉', '👍', '👑', '👀', '✨'];
    const reactionInterval = setInterval(() => {
      const activeScreen = document.querySelector('.iphone-view.active');
      if (activeScreen && activeScreen.id === 'phone-screen-qh-invite') {
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        spawnFloatingEmoji(randomEmoji);
      } else {
        clearInterval(reactionInterval);
      }
    }, 450);

    const avatarList = document.getElementById('qh-avatar-list');
    const badge = document.getElementById('qh-crew-count-badge');
    if (avatarList) avatarList.innerHTML = '';
    if (badge) {
      badge.textContent = '+0 crew';
      badge.style.background = 'rgba(255, 255, 255, 0.05)';
      badge.style.color = 'var(--text-secondary)';
    }

    const crew = [
      { name: 'Sarah', init: 'S', color: 'var(--lime)' },
      { name: 'David', init: 'D', color: 'var(--purple)' },
      { name: 'Jessica', init: 'J', color: '#ff007f' },
      { name: 'Michael', init: 'M', color: '#00f0ff' },
    ];

    crew.forEach((member, index) => {
      setTimeout(
        () => {
          // Double check that we are still in invite screen to prevent overflow joins
          const activeScreen = document.querySelector('.iphone-view.active');
          if (!activeScreen || activeScreen.id !== 'phone-screen-qh-invite') return;

          const bubble = document.createElement('div');
          bubble.style.width = '26px';
          bubble.style.height = '26px';
          bubble.style.borderRadius = '50%';
          bubble.style.background = member.color;
          bubble.style.color = member.color === 'var(--lime)' ? 'var(--text-dark)' : '#ffffff';
          bubble.style.display = 'flex';
          bubble.style.alignItems = 'center';
          bubble.style.justifyContent = 'center';
          bubble.style.fontSize = '0.7rem';
          bubble.style.fontWeight = '800';
          bubble.style.border = '1.5px solid #111';
          bubble.style.marginLeft = index === 0 ? '0px' : '-8px';
          bubble.style.transform = 'scale(0) translateY(10px)';
          bubble.style.opacity = '0';
          bubble.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
          bubble.textContent = member.init;

          if (avatarList) avatarList.appendChild(bubble);

          setTimeout(() => {
            bubble.style.transform = 'scale(1) translateY(0)';
            bubble.style.opacity = '1';
          }, 50);

          if (badge) {
            badge.textContent = `+${index + 1} crew`;
            badge.style.background = 'rgba(173, 255, 47, 0.1)';
            badge.style.color = 'var(--lime)';
          }

          // Spawn specific emoji reaction to make lobby feel hyperactive
          const memberEmoji = index === 0 ? '❤️' : index === 1 ? '🔥' : index === 2 ? '👑' : '🎉';
          spawnFloatingEmoji(memberEmoji);

          triggerSimulatorToast(
            `${member.name.toUpperCase()} JOINED`,
            'Crew lobby updating...',
            'epic'
          );
        },
        (index + 1) * 900
      );
    });
  };

  // ==========================================
  // 11. REWARD THEMES, MAP CLICKS, AND PARTICLES
  // ==========================================

  const rewardThemes = {
    'nike-air-mag': {
      name: 'Nike Air Mag (RTFKT Edition)',
      subtitle: 'Limited Edition Drop',
      desc: 'RTFKT x Nike Collaboration. Verified Claim. Projects in AR relative to player geolocation.',
      value: '$1,200',
      color: '#f97316',
      rarity: 'LEGENDARY',
      icon: '👟',
      svgType: 'nike-air-mag',
    },
    'cash-vault': {
      name: 'Mythic Cash Vault',
      subtitle: 'District Safe Jackpot',
      desc: 'Golden City Safe Vault containing $10,000 in virtual cash. High-velocity cache.',
      value: 'JACKPOT',
      color: '#ef4444',
      rarity: 'MYTHIC',
      icon: '🔑',
      svgType: 'cash-vault',
    },
    'supreme-crate': {
      name: 'Supreme Supply Crate',
      subtitle: 'Mystery Bounty',
      desc: 'RTFKT Mystery Supply Crate containing premium streetwear and NFT claims. Code active.',
      value: 'NYC DROP',
      color: '#a855f7',
      rarity: 'EPIC',
      icon: '📦',
      svgType: 'supreme-crate',
    },
    'xp-beacon': {
      name: 'Rare XP Beacon',
      subtitle: 'District Booster',
      desc: 'Double XP District Beacon. Boosts all snatch XP rewards by 2x for nearby players.',
      value: 'XP BOOST',
      color: '#3b82f6',
      rarity: 'RARE',
      icon: '⚡',
      svgType: 'xp-beacon',
    },
    'creator-token': {
      name: 'Creator Token',
      subtitle: 'Fan Bounty',
      desc: 'Influencer Creator Coin Bounty. Fan-exclusive token representing governance and rewards.',
      value: 'FAN REWARD',
      color: '#14b8a6',
      rarity: 'RARE',
      icon: '🪙',
      svgType: 'creator-token',
    },
    'vip-pass': {
      name: 'VIP Concert Pass',
      subtitle: 'Access Ticket',
      desc: 'Music Festival VIP Access Pass. Snatch exclusive pass for behind-the-scenes entry.',
      value: 'ACCESS PASS',
      color: '#39FF14',
      rarity: 'LEGENDARY',
      icon: '🎟️',
      svgType: 'vip-pass',
    },
  };

  const hexToRgba = (hex, alpha) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const matchingCodeForReward = (name) => {
    if (name.includes('Mag')) return 'MAG-RTFKT-99X';
    if (name.includes('Vault')) return 'JACKPOT-SAFE-77';
    if (name.includes('Crate')) return 'MYST-CRATE-99X';
    if (name.includes('Beacon')) return 'BEACON-XP-888';
    if (name.includes('Token')) return 'CREATOR-COIN-0';
    return 'VIP-CONCERT-VIP';
  };

  const getRewardSVG = (type, color) => {
    const colorRgba008 = hexToRgba(color, 0.08);
    const colorRgba015 = hexToRgba(color, 0.15);
    const colorRgba02 = hexToRgba(color, 0.2);
    const colorRgba03 = hexToRgba(color, 0.3);

    let frontPaths = '';
    let corePaths = '';
    let backPaths = '';

    switch (type) {
      case 'nike-air-mag':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Upper laces / Velcro strap -->
            <path d="M 32,36 L 46,39 L 44,43 L 30,40 Z" fill="${colorRgba015}" stroke-width="1.5" />
            <line x1="35" y1="38" x2="35" y2="41" stroke-width="1" />
            <line x1="39" y1="39" x2="39" y2="42" stroke-width="1" />
            <line x1="43" y1="40" x2="43" y2="43" stroke-width="1" />
            <!-- Power Laces (glowing bars) -->
            <line x1="47" y1="45" x2="52" y2="47" stroke-width="2.5" stroke-linecap="round" />
            <line x1="50" y1="49" x2="56" y2="51" stroke-width="2.5" stroke-linecap="round" />
            <line x1="53" y1="53" x2="59" y2="55" stroke-width="2.5" stroke-linecap="round" />
            <!-- Lacing straps/cables -->
            <path d="M 45,64 Q 55,60 68,64" stroke-width="1.5" stroke-linecap="round" />
            <path d="M 50,56 L 56,48 M 53,53 L 59,45" stroke-width="1.5" stroke-linecap="round" />
            <!-- Front strap / glow badges -->
            <path d="M 50,60 L 62,56 L 68,62 L 53,63 Z" stroke-width="1" fill="${colorRgba015}" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Swoosh logo fill -->
            <path d="M 45,58 Q 55,56 68,59 Q 58,63 46,63 Z" fill="${colorRgba03}" stroke-width="1.2" />
            <!-- High-top Collar & Tongue background fill -->
            <path d="M 28,40 L 40,24 L 54,30 L 47,44 Z" fill="${colorRgba015}" stroke-width="1" />
            <!-- Heel LEDs -->
            <circle cx="21" cy="65" r="1.5" fill="${color}" stroke="none" />
            <circle cx="26" cy="67" r="1.5" fill="${color}" stroke="none" />
            <circle cx="31" cy="69" r="1.5" fill="${color}" stroke="none" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5" opacity="0.7">
            <!-- Sole/Midsole base outline -->
            <path d="M 20,70 Q 25,74 35,74 T 70,72 Q 80,68 85,60" stroke-width="2.5" />
            <!-- Upper main collar and heel outline -->
            <path d="M 20,70 L 25,58 Q 30,52 40,54 L 52,56 Q 58,45 68,42 L 80,48 Q 85,52 85,60" stroke-width="2" />
            <path d="M 16,71 C 12,65 14,53 22,53" />
            <path d="M 22,53 Q 23,45 28,40" />
          </g>
        `;
        break;

      case 'cash-vault':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Large dial lock center gear -->
            <circle cx="50" cy="50" r="12" stroke-width="2.5" />
            <circle cx="50" cy="50" r="5" stroke-width="1.5" />
            <!-- Vault lock handle & dial spokes -->
            <line x1="50" y1="32" x2="50" y2="38" stroke-width="2.5" stroke-linecap="round" />
            <line x1="50" y1="62" x2="50" y2="68" stroke-width="2.5" stroke-linecap="round" />
            <line x1="32" y1="50" x2="38" y2="50" stroke-width="2.5" stroke-linecap="round" />
            <line x1="62" y1="50" x2="68" y2="50" stroke-width="2.5" stroke-linecap="round" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Front frame bevel & glowing infill -->
            <polygon points="50,23 77,36.5 77,63.5 50,77 23,63.5 23,36.5" stroke-width="1.5" fill="${colorRgba015}" />
            <circle cx="50" cy="50" r="22" stroke-width="1" stroke-dasharray="3 3" opacity="0.6" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5" opacity="0.7">
            <!-- Main isometric cube frame (back lines) -->
            <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" stroke-width="2" />
            <line x1="20" y1="35" x2="50" y2="50" stroke-width="1" opacity="0.5" />
            <line x1="80" y1="35" x2="50" y2="50" stroke-width="1" opacity="0.5" />
            <line x1="50" y1="80" x2="50" y2="50" stroke-width="1" opacity="0.5" />
          </g>
        `;
        break;

      case 'supreme-crate':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Front lock latch mechanism -->
            <rect x="42" y="44" width="16" height="16" rx="3" fill="${colorRgba03}" stroke-width="2" />
            <circle cx="50" cy="52" r="2.5" fill="${color}" />
            <!-- Top vertex cap front details -->
            <polygon points="50,15 57,17.7 50,20.5 43,17.7" fill="${colorRgba02}" stroke-width="1" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Inner panel outlines & glowing core -->
            <polyline points="20,37 50,52 80,37" stroke-width="2" />
            <line x1="50" y1="52" x2="50" y2="82" stroke-width="2" />
            <polygon points="21,32 45,41.5 45,71.5 21,62" stroke-width="1" fill="${colorRgba008}" />
            <polygon points="55,41.5 79,32 79,62 55,71.5" stroke-width="1" fill="${colorRgba008}" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5" opacity="0.7">
            <!-- Main isometric crate frame box -->
            <polygon points="50,22 80,37 80,67 50,82 20,67 20,37" stroke-width="2" />
            <!-- Back structural corners -->
            <line x1="20" y1="37" x2="20" y2="67" stroke-width="1.2" />
            <line x1="80" y1="37" x2="80" y2="67" stroke-width="1.2" />
          </g>
        `;
        break;

      case 'xp-beacon':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Front structural legs -->
            <line x1="50" y1="30" x2="35" y2="75" stroke-width="2" />
            <line x1="50" y1="30" x2="65" y2="75" stroke-width="2" />
            <!-- Front horizontal brace support -->
            <line x1="42.5" y1="52.5" x2="57.5" y2="52.5" stroke-width="1.5" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Core floating power element -->
            <polygon points="50,15 57,25 50,33 43,25" stroke-width="1.5" fill="${colorRgba03}" />
            <!-- Signal waves circles -->
            <circle cx="50" cy="25" r="10" stroke-width="1" stroke-dasharray="3 3" opacity="0.7" />
            <circle cx="50" cy="25" r="18" stroke-width="1" stroke-dasharray="4 4" opacity="0.4" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5" opacity="0.6">
            <!-- Rear support pillar & grounding pad -->
            <line x1="50" y1="30" x2="50" y2="75" stroke-width="1.5" stroke-dasharray="2 2" />
            <ellipse cx="50" cy="75" rx="16" ry="6" stroke-width="2" fill="${colorRgba008}" />
          </g>
        `;
        break;

      case 'creator-token':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2">
            <!-- Central currency code/glyph -->
            <path d="M53.5,41 H49 C47.5,41 46.5,42 46.5,43.5 C46.5,44.7 47.5,45.5 48.5,45.8 L51.5,46.7 C52.5,47 53.5,47.8 53.5,49 C53.5,50.5 52.5,51.5 51,51.5 H46.5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
            <!-- Double currency stroke lines -->
            <line x1="50" y1="38" x2="50" y2="55" stroke-width="2.5" stroke-linecap="round" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5">
            <!-- Dotted inner circle details -->
            <circle cx="50" cy="48" r="16" stroke-width="1" stroke-dasharray="4 2" />
            <!-- Radial details / notch ticks -->
            <line x1="50" y1="23" x2="50" y2="27" stroke-width="1.5" />
            <line x1="50" y1="69" x2="50" y2="73" stroke-width="1.5" />
            <line x1="25" y1="48" x2="29" y2="48" stroke-width="1.5" />
            <line x1="71" y1="48" x2="75" y2="48" stroke-width="1.5" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="2" opacity="0.7">
            <!-- Coin outer rim circle -->
            <circle cx="50" cy="48" r="22" stroke-width="3" fill="${colorRgba008}" />
          </g>
        `;
        break;

      case 'vip-pass':
        frontPaths = `
          <g stroke="${color}" fill="none" stroke-width="2" transform="rotate(-5 50 48)">
            <!-- Bold VIP title lettering -->
            <path d="M 40,40 L 45,52 L 50,40" stroke-width="2.8" stroke-linecap="round" />
            <line x1="54" y1="40" x2="54" y2="52" stroke-width="2.8" stroke-linecap="round" />
            <path d="M 58,40 H 64 Q 67,40 67,43 T 64,46 H 58" stroke-width="2.8" stroke-linecap="round" />
          </g>
        `;
        corePaths = `
          <g stroke="${color}" fill="none" stroke-width="1.5" transform="rotate(-5 50 48)">
            <!-- Ticket perforation and barcode details -->
            <line x1="32" y1="60" x2="68" y2="60" stroke-width="1.2" stroke-dasharray="3 2" />
            <line x1="38" y1="65" x2="38" y2="70" stroke-width="2" />
            <line x1="42" y1="65" x2="42" y2="70" stroke-width="1" />
            <line x1="45" y1="65" x2="45" y2="70" stroke-width="3" />
            <line x1="50" y1="65" x2="50" y2="70" stroke-width="1.5" />
            <line x1="54" y1="65" x2="54" y2="70" stroke-width="2.2" />
            <line x1="58" y1="65" x2="58" y2="70" stroke-width="1" />
            <line x1="62" y1="65" x2="62" y2="70" stroke-width="2" />
          </g>
        `;
        backPaths = `
          <g stroke="${color}" fill="none" stroke-width="2" opacity="0.7" transform="rotate(-5 50 48)">
            <!-- Pass card base body frame outline -->
            <rect x="32" y="22" width="36" height="52" rx="4.5" stroke-width="2.2" fill="${colorRgba008}" />
            <!-- Lanyard ring outline -->
            <circle cx="50" cy="28" r="3" stroke-width="1.5" />
          </g>
        `;
        break;
    }

    const makeLayer = (paths, className, styleOverride) => `
      <svg class="holo-svg ${className}" viewBox="0 0 100 100" style="position: absolute; width: 100%; height: 100%; pointer-events: none; ${styleOverride}">
        <defs>
          <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        ${paths}
      </svg>
    `;

    const frontLayer = makeLayer(
      frontPaths,
      'holo-front',
      'transform: translateZ(24px); --holo-glow-soft: ' +
        hexToRgba(color, 0.5) +
        '; --holo-glow-bright: ' +
        color +
        ';'
    );
    const coreLayer = makeLayer(
      corePaths,
      'holo-core',
      'transform: translateZ(4px) scale(0.95); --holo-glow-soft: ' +
        hexToRgba(color, 0.6) +
        '; --holo-glow-bright: ' +
        color +
        ';'
    );
    const backLayer = makeLayer(
      backPaths,
      'holo-back',
      'transform: translateZ(-20px) rotateY(180deg); --holo-glow-soft: ' +
        hexToRgba(color, 0.45) +
        '; --holo-glow-bright: ' +
        color +
        ';'
    );

    return `
      <div class="holo-object-3d" style="--holo-glow-soft: ${hexToRgba(color, 0.45)}; --holo-glow-bright: ${color};">
        <div class="holo-object-inner">
          <div class="holo-shadow"></div>
          <div class="holo-orbit holo-orbit-1"></div>
          <div class="holo-orbit holo-orbit-2"></div>
          <div class="holo-side-glow"></div>
          <div class="holo-scanline"></div>
          ${backLayer}
          ${coreLayer}
          ${frontLayer}
        </div>
      </div>
    `;
  };

  const spawnFloatingEmoji = (emoji) => {
    const activeView = document.querySelector('.iphone-view.active');
    if (!activeView) return;
    const emojiEl = document.createElement('div');
    emojiEl.className = 'floating-emoji';
    emojiEl.textContent = emoji;
    emojiEl.style.left = `${30 + Math.random() * 40}%`;
    activeView.appendChild(emojiEl);
    setTimeout(() => {
      if (emojiEl.parentNode) emojiEl.parentNode.removeChild(emojiEl);
    }, 2200);
  };

  const getDistrictFromCoords = (x, y) => {
    if (x < 150 && y < 120) return { name: 'TriBeCa', label: 'TRIBECA' };
    if (x >= 150 && x < 250 && y < 120) return { name: 'NoHo', label: 'NOHO' };
    if (x >= 250 && y < 120) return { name: 'Nolita', label: 'NOLITA' };
    if (x < 150 && y >= 120 && y < 200)
      return { name: 'Greenwich Village', label: 'GREENWICH VILLAGE' };
    if (x >= 150 && x < 250 && y >= 120 && y < 200) return { name: 'SoHo', label: 'SOHO' };
    if (x >= 250 && y >= 120 && y < 200) return { name: 'Bowery', label: 'BOWERY' };
    if (x < 180 && y >= 200) return { name: 'Chinatown', label: 'CHINATOWN' };
    return { name: 'Lower East Side', label: 'LOWER EAST SIDE' };
  };

  // Reusable XP progression system
  const gainXP = (amount) => {
    state.player.xp += amount;

    // Spawn floating XP text floater in active phone screen
    const activeView = document.querySelector('.iphone-view.active');
    if (activeView) {
      const floater = document.createElement('div');
      floater.textContent = `+${amount} XP`;
      floater.style.position = 'absolute';
      floater.style.left = '50%';
      floater.style.bottom = '120px';
      floater.style.transform = 'translateX(-50%)';
      floater.style.fontFamily = 'var(--font-title)';
      floater.style.fontWeight = '800';
      floater.style.fontSize = '1.3rem';
      floater.style.color = 'var(--purple)';
      floater.style.textShadow = '0 0 10px var(--purple-glow)';
      floater.style.zIndex = '150';
      floater.style.pointerEvents = 'none';
      floater.style.opacity = '1';
      floater.style.transition = 'all 0.9s cubic-bezier(0.16, 1, 0.3, 1)';

      activeView.appendChild(floater);
      floater.offsetHeight; // Force reflow
      floater.style.transform = 'translateX(-50%) translateY(-60px)';
      floater.style.opacity = '0';

      setTimeout(() => {
        if (floater.parentNode) floater.parentNode.removeChild(floater);
      }, 900);
    }

    let isLevelUp = false;
    if (state.player.xp >= state.player.xpNext) {
      state.player.level += 1;
      state.player.xp = state.player.xp - state.player.xpNext;
      isLevelUp = true;
    }

    // Update XP stats on Profile Screen
    const profileLevelLabel = document.querySelector('.profile-level-label');
    if (profileLevelLabel) profileLevelLabel.textContent = `Level ${state.player.level} Hunter`;

    const profileAvatarBadge = document.querySelector('.profile-avatar-badge');
    if (profileAvatarBadge) profileAvatarBadge.textContent = state.player.level;

    const profileXpRow = document.querySelector('.profile-xp-row');
    if (profileXpRow) {
      profileXpRow.innerHTML = `<span>${state.player.xpNext - state.player.xp} XP to Level ${state.player.level + 1}</span><span>${state.player.xp} / ${state.player.xpNext}</span>`;
    }

    const xpBarInner = document.querySelector('.xp-bar-inner');
    if (xpBarInner) {
      xpBarInner.style.width = `${(state.player.xp / state.player.xpNext) * 100}%`;
    }

    // Increment snatch count and update UI
    state.player.totalSnatches += 1;
    const totalSnatchesVal = document.querySelector(
      '.profile-stat-box:nth-child(1) .profile-stat-val'
    );
    if (totalSnatchesVal) totalSnatchesVal.textContent = state.player.totalSnatches;

    if (isLevelUp) {
      setTimeout(() => {
        const levelUpModal = document.getElementById('phone-modal-levelup');
        const levelTitle = document.getElementById('levelup-level-title');
        if (levelTitle) {
          levelTitle.textContent = `Level ${state.player.level}`;
        }
        if (levelUpModal) {
          levelUpModal.classList.add('active');
        }
        triggerSimulatorToast(
          'LEVEL UP!',
          `You reached Level ${state.player.level}! +250 AP awarded.`,
          'legendary'
        );
      }, 500);
    }
  };

  // Initialize Global Canvas Particles System
  const initAmbientParticles = () => {
    const canvas = document.getElementById('ambient-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 40;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.color = Math.random() > 0.5 ? 'rgba(57, 255, 20, ' : 'rgba(168, 85, 247, ';
        this.alpha = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > width || this.y < 0) {
          this.reset();
          this.y = height;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = this.color.includes('168') ? '#a855f7' : '#39ff14';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const gridPulses = [];

    const triggerGridPulse = (x, y) => {
      gridPulses.push({
        x: x || Math.random() * width,
        y: y || Math.random() * height,
        r: 0,
        maxR: Math.random() * 80 + 40,
        alpha: 0.25,
        color: Math.random() > 0.5 ? 'rgba(57, 255, 20, ' : 'rgba(168, 85, 247, ',
      });
    };

    setInterval(() => {
      if (gridPulses.length < 3) {
        triggerGridPulse();
      }
    }, 4500);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = gridPulses.length - 1; i >= 0; i--) {
        const pulse = gridPulses[i];
        pulse.r += 0.6;
        pulse.alpha -= 0.003;

        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.r, 0, Math.PI * 2);
        ctx.strokeStyle = pulse.color + pulse.alpha + ')';
        ctx.lineWidth = 1;
        ctx.stroke();

        if (pulse.alpha <= 0 || pulse.r >= pulse.maxR) {
          gridPulses.splice(i, 1);
        }
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    document.addEventListener('click', (e) => {
      if (Math.random() > 0.45) {
        triggerGridPulse(e.clientX, e.clientY);
      }
    });
  };

  // Wire up interactive reward cards grid clicks
  if (rewardSelectCards.length > 0) {
    rewardSelectCards.forEach((card) => {
      card.addEventListener('click', () => {
        rewardSelectCards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');

        const rewardType = card.getAttribute('data-reward');
        const theme = rewardThemes[rewardType];
        if (!theme) return;

        state.campaign.rewardName = theme.name;
        state.campaign.rewardVal = theme.value;

        if (rewardPreviewMainTitle) {
          rewardPreviewMainTitle.textContent = theme.name;
          if (rewardPreviewMainTitle.nextElementSibling) {
            rewardPreviewMainTitle.nextElementSibling.textContent = theme.subtitle;
          }
        }

        const previewDesc = document.querySelector('.holo-visual-container + div p');
        if (previewDesc) {
          previewDesc.textContent = theme.desc;
        }

        const newSvgMarkup = getRewardSVG(theme.svgType, theme.color);
        if (previewSvgWrapper) {
          previewSvgWrapper.innerHTML = newSvgMarkup;
          // Apply rapid scale-in effect to preview hologram
          previewSvgWrapper.style.transform = 'scale(0.8)';
          setTimeout(() => {
            previewSvgWrapper.style.transform = 'scale(1)';
          }, 150);
        }
        if (phoneSvgWrapper) {
          phoneSvgWrapper.innerHTML = newSvgMarkup;
        }
        if (approachSvgWrapper) {
          approachSvgWrapper.innerHTML = newSvgMarkup;
        }

        const formPreviewName = document.getElementById('reward-name-preview');
        if (formPreviewName) {
          formPreviewName.textContent = theme.name;
          if (formPreviewName.nextElementSibling) {
            formPreviewName.nextElementSibling.textContent = theme.subtitle;
          }
        }
        const formPreviewImgBox = document.querySelector('.reward-preview-img-box');
        if (formPreviewImgBox) {
          formPreviewImgBox.innerHTML = newSvgMarkup;
          const container = formPreviewImgBox.querySelector('.holo-svg-container-3d');
          if (container) {
            container.style.width = '30px';
            container.style.height = '30px';
          }
          formPreviewImgBox.style.boxShadow = `0 0 10px ${hexToRgba(theme.color, 0.4)}`;
        }

        const previewBadge = document
          .querySelector('.holo-visual-container')
          .previousElementSibling.querySelector('.badge');
        if (previewBadge) {
          previewBadge.textContent = theme.rarity;
          previewBadge.style.color = theme.color;
          previewBadge.style.borderColor = theme.color;
          previewBadge.style.backgroundColor = hexToRgba(theme.color, 0.1);
        }

        const discoverHoloTag = document.getElementById('discover-holo-item-box');
        if (discoverHoloTag) {
          const badge = discoverHoloTag.querySelector('.badge');
          if (badge) {
            badge.textContent = theme.rarity;
            badge.className = `badge ${theme.rarity.toLowerCase()}`;
            badge.style.background = hexToRgba(theme.color, 0.15);
            badge.style.color = theme.color;
            badge.style.borderColor = theme.color;
          }
        }

        triggerSimulatorToast(
          'REWARD UPDATED',
          `Selected ${theme.name} (${theme.rarity}).`,
          theme.rarity.toLowerCase()
        );
      });
    });
  }

  // Wire up geofence map click events
  const mapSvg = document.getElementById('studio-map-svg');
  const geofenceCircle = document.getElementById('studio-geofence-circle');
  const geofencePulseRing = document.getElementById('studio-geofence-pulse-ring');
  const mapFrame = document.querySelector('.map-frame');

  if (mapSvg) {
    mapSvg.addEventListener('click', (e) => {
      const rect = mapSvg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 400;
      const y = ((e.clientY - rect.top) / rect.height) * 300;

      if (geofenceCircle) {
        geofenceCircle.setAttribute('cx', x);
        geofenceCircle.setAttribute('cy', y);
        geofenceCircle.style.transformOrigin = `${x}px ${y}px`;
      }
      if (geofencePulseRing) {
        geofencePulseRing.setAttribute('cx', x);
        geofencePulseRing.setAttribute('cy', y);
        geofencePulseRing.style.transformOrigin = `${x}px ${y}px`;
        // Trigger localized coordinates placement pulse
        if (!state.campaign.active) {
          geofencePulseRing.classList.remove('studio-geofence-pulse-single-active');
          geofencePulseRing.offsetHeight; // force reflow
          geofencePulseRing.classList.add('studio-geofence-pulse-single-active');
        }
      }

      const mapPin = mapSvg.querySelector('.map-pin');
      if (mapPin) {
        mapPin.setAttribute('cx', x);
        mapPin.setAttribute('cy', y);
      }

      const district = getDistrictFromCoords(x, y);

      if (campaignLocationInput) {
        campaignLocationInput.value = `${district.name}, New York, NY`;
      }

      const mapText = mapSvg.querySelector('text');
      if (mapText) {
        mapText.textContent = district.label;
        mapText.setAttribute('x', x);
        mapText.setAttribute('y', Math.max(30, y - 35));
      }

      if (mapFrame) {
        mapFrame.classList.remove('flash-active');
        mapFrame.offsetHeight;
        mapFrame.classList.add('flash-active');
      }

      const phoneRadarDistrict = document.querySelector('#discover-radar-preview div:last-child');
      if (phoneRadarDistrict) {
        phoneRadarDistrict.textContent = `${district.name}, NYC`;
      }

      const broadcastingDetails = document.getElementById('broadcasting-details');
      if (broadcastingDetails) {
        broadcastingDetails.textContent = `Broadcasting to ${district.name} Grid...`;
      }

      const viewsEl = document.querySelector('.three-col-grid .stat-card:nth-child(1) .stat-value');
      const startsEl = document.querySelector(
        '.three-col-grid .stat-card:nth-child(2) .stat-value'
      );
      const claimsEl = document.querySelector(
        '.three-col-grid .stat-card:nth-child(3) .stat-value'
      );
      const redemptionsEl = document.querySelector(
        '.two-col-grid .stat-card:nth-child(1) .stat-value'
      );
      const completionEl = document.querySelector(
        '.two-col-grid .stat-card:nth-child(2) .stat-value'
      );

      if (viewsEl) {
        const currentVal = parseInt(viewsEl.textContent.replace(/,/g, '')) || 0;
        const newVal = Math.floor(15000 + Math.random() * 10000);
        animateCountUp(viewsEl, currentVal, newVal, 800);
      }
      if (startsEl) {
        const currentVal = parseInt(startsEl.textContent.replace(/,/g, '')) || 0;
        const newVal = Math.floor(4000 + Math.random() * 2000);
        animateCountUp(startsEl, currentVal, newVal, 800);
      }
      if (claimsEl) {
        const currentVal = parseInt(claimsEl.textContent.replace(/,/g, '')) || 0;
        const newVal = Math.floor(1000 + Math.random() * 1000);
        animateCountUp(claimsEl, currentVal, newVal, 800);
      }
      if (redemptionsEl) {
        const currentVal = parseInt(redemptionsEl.textContent.replace(/,/g, '')) || 0;
        const newVal = Math.floor(500 + Math.random() * 500);
        animateCountUp(redemptionsEl, currentVal, newVal, 800);
      }
      if (completionEl) {
        const newVal = (15 + Math.random() * 10).toFixed(1) + '%';
        completionEl.textContent = newVal;
      }

      triggerSimulatorToast('GRID RELOCATED', `Drop zone moved to ${district.name}.`, 'epic');
    });
  }

  // Wire up overview Live Faction conquest cells clicks
  const overviewCells = document.querySelectorAll('#view-overview .conquest-cell');
  const showcaseDistrict = document.getElementById('showcase-district-name');
  const showcaseFaction = document.getElementById('showcase-faction-name');
  const showcaseControl = document.getElementById('showcase-control-rate');
  const showcaseDrops = document.getElementById('showcase-drops-count');

  if (overviewCells.length > 0) {
    overviewCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        overviewCells.forEach((c) => c.classList.remove('active'));
        cell.classList.add('active');

        const district = cell.getAttribute('data-district');
        const faction = cell.getAttribute('data-faction');
        const control = cell.getAttribute('data-control');
        const drops = cell.getAttribute('data-drops');

        if (showcaseDistrict) showcaseDistrict.textContent = district;
        if (showcaseFaction) showcaseFaction.textContent = faction;
        if (showcaseControl) showcaseControl.textContent = control;
        if (showcaseDrops) showcaseDrops.textContent = drops;

        triggerSimulatorToast(
          'DISTRICT SELECTED',
          `Inspecting local stats for ${district}.`,
          'epic'
        );
      });
    });
  }

  // Wire up ambassadors Faction Zone conquest cells clicks
  const ambassadorCells = document.querySelectorAll('#ambassador-conquest-svg .conquest-cell');
  const conquestDistrict = document.getElementById('conquest-district-name');
  const conquestOperator = document.getElementById('conquest-operator-name');
  const conquestMembers = document.getElementById('conquest-members-count');
  const conquestInfluence = document.getElementById('conquest-influence-rate');
  const conquestDrop = document.getElementById('conquest-drop-type');

  if (ambassadorCells.length > 0) {
    ambassadorCells.forEach((cell) => {
      cell.addEventListener('click', () => {
        ambassadorCells.forEach((c) => c.classList.remove('active'));
        cell.classList.add('active');

        const district = cell.getAttribute('data-district');
        const operator = cell.getAttribute('data-operator');
        const members = cell.getAttribute('data-members');
        const influence = cell.getAttribute('data-influence');
        const drop = cell.getAttribute('data-drop');

        if (conquestDistrict) conquestDistrict.textContent = district;
        if (conquestOperator) conquestOperator.textContent = operator;
        if (conquestMembers) conquestMembers.textContent = `${members} members`;
        if (conquestInfluence) conquestInfluence.textContent = influence;
        if (conquestDrop) conquestDrop.textContent = drop;

        let matchingReward = 'nike-air-mag';
        if (drop.includes('Safe') || drop.includes('Jackpot') || drop.includes('Vault'))
          matchingReward = 'cash-vault';
        else if (drop.includes('Crate') || drop.includes('Mystery'))
          matchingReward = 'supreme-crate';
        else if (drop.includes('Beacon') || drop.includes('XP')) matchingReward = 'xp-beacon';
        else if (drop.includes('Token') || drop.includes('Creator'))
          matchingReward = 'creator-token';
        else if (drop.includes('VIP') || drop.includes('Pass')) matchingReward = 'vip-pass';

        const theme = rewardThemes[matchingReward];
        if (theme && phoneSvgWrapper) {
          const newSvgMarkup = getRewardSVG(theme.svgType, theme.color);
          phoneSvgWrapper.innerHTML = newSvgMarkup;
          if (approachSvgWrapper) {
            approachSvgWrapper.innerHTML = newSvgMarkup;
          }

          const discoverHoloTag = document.getElementById('discover-holo-item-box');
          if (discoverHoloTag) {
            const badge = discoverHoloTag.querySelector('.badge');
            if (badge) {
              badge.textContent = theme.rarity;
              badge.style.color = theme.color;
              badge.style.borderColor = theme.color;
              badge.style.background = hexToRgba(theme.color, 0.15);
            }
          }
        }

        triggerSimulatorToast(
          'FACTION EXPANSION',
          `${operator} controls ${district}.`,
          'legendary'
        );
      });
    });
  }

  // Highlight daily streak stat box on DOM load
  const streakBox = document.querySelector('.profile-stat-box:nth-child(3)');
  if (streakBox) {
    streakBox.style.boxShadow = '0 0 12px rgba(249, 115, 22, 0.15)';
    streakBox.style.borderColor = 'rgba(249, 115, 22, 0.4)';
  }

  // Ticker to tick views, starts, claims, redemptions slowly
  setInterval(() => {
    if (state.campaign.active) {
      const viewsEl = document.querySelector('.three-col-grid .stat-card:nth-child(1) .stat-value');
      const startsEl = document.querySelector(
        '.three-col-grid .stat-card:nth-child(2) .stat-value'
      );
      const claimsEl = document.querySelector(
        '.three-col-grid .stat-card:nth-child(3) .stat-value'
      );
      const redemptionsEl = document.querySelector(
        '.two-col-grid .stat-card:nth-child(1) .stat-value'
      );

      if (viewsEl) {
        const currentVal = parseInt(viewsEl.textContent.replace(/,/g, '')) || 0;
        const add = Math.floor(1 + Math.random() * 4);
        viewsEl.textContent = (currentVal + add).toLocaleString();
      }
      if (startsEl) {
        const currentVal = parseInt(startsEl.textContent.replace(/,/g, '')) || 0;
        const add = Math.random() > 0.45 ? 1 : 0;
        startsEl.textContent = (currentVal + add).toLocaleString();
      }
      if (claimsEl) {
        const currentVal = parseInt(claimsEl.textContent.replace(/,/g, '')) || 0;
        const add = Math.random() > 0.75 ? 1 : 0;
        claimsEl.textContent = (currentVal + add).toLocaleString();
      }
      if (redemptionsEl) {
        const currentVal = parseInt(redemptionsEl.textContent.replace(/,/g, '')) || 0;
        const add = Math.random() > 0.85 ? 1 : 0;
        redemptionsEl.textContent = (currentVal + add).toLocaleString();
      }

      const huntersVal = document.getElementById('telemetry-hunters');
      const impressionsVal = document.getElementById('telemetry-impressions');
      if (huntersVal) {
        const currentVal = parseInt(huntersVal.textContent.replace(/,/g, '')) || 0;
        const add = Math.floor(-1 + Math.random() * 3);
        huntersVal.textContent = (currentVal + add).toLocaleString();
      }
      if (impressionsVal) {
        const currentVal = parseInt(impressionsVal.textContent.replace(/,/g, '')) || 0;
        const add = Math.floor(1 + Math.random() * 5);
        impressionsVal.textContent = (currentVal + add).toLocaleString();
      }
    }
  }, 4000);

  // Live city activity map node flickers
  setInterval(() => {
    const playerDots = document.querySelectorAll('.map-player-dot');
    playerDots.forEach((dot) => {
      dot.style.transition = 'opacity 0.4s ease';
      dot.style.opacity = Math.random() > 0.3 ? '0.9' : '0.4';
    });

    const mapPath = document.querySelector('.map-path');
    if (mapPath) {
      mapPath.style.transition = 'opacity 0.5s ease';
      mapPath.style.opacity = Math.random() > 0.2 ? '0.8' : '0.35';
    }
  }, 1200);

  // Trigger initial 3D SVG generation on DOM load
  const initialSvgMarkup = getRewardSVG('nike-air-mag', '#f97316');
  if (previewSvgWrapper) {
    previewSvgWrapper.innerHTML = initialSvgMarkup;
  }
  if (phoneSvgWrapper) {
    phoneSvgWrapper.innerHTML = initialSvgMarkup;
  }
  if (approachSvgWrapper) {
    approachSvgWrapper.innerHTML = initialSvgMarkup;
  }

  // Render 3D hero/stage holograms
  const heroSneakerStage = document.querySelector('.stage-hologram.legendary-stage');
  const heroVaultStage = document.querySelector('.stage-hologram.mythic-stage');
  const heroCrateStage = document.querySelector('.stage-hologram.epic-stage');

  if (heroSneakerStage) {
    const stageSvg = heroSneakerStage.querySelector('.stage-svg');
    if (stageSvg) {
      const parent = stageSvg.parentNode;
      const newDiv = document.createElement('div');
      newDiv.className = 'stage-svg';
      newDiv.innerHTML = getRewardSVG('nike-air-mag', '#f97316');
      parent.replaceChild(newDiv, stageSvg);
    }
  }

  if (heroVaultStage) {
    const stageSvg = heroVaultStage.querySelector('.stage-svg');
    if (stageSvg) {
      const parent = stageSvg.parentNode;
      const newDiv = document.createElement('div');
      newDiv.className = 'stage-svg';
      newDiv.innerHTML = getRewardSVG('cash-vault', '#ef4444');
      parent.replaceChild(newDiv, stageSvg);
    }
  }

  if (heroCrateStage) {
    const stageSvg = heroCrateStage.querySelector('.stage-svg');
    if (stageSvg) {
      const parent = stageSvg.parentNode;
      const newDiv = document.createElement('div');
      newDiv.className = 'stage-svg';
      newDiv.innerHTML = getRewardSVG('supreme-crate', '#a855f7');
      parent.replaceChild(newDiv, stageSvg);
    }
  }

  // Initialize Canvas Particles System
  initAmbientParticles();
});
