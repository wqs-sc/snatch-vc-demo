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
      title: 'Nike SoHo Sneaker Hunt',
      radius: 250,
      rewardName: 'Nike Air Max 2025',
      rewardVal: 'Physical Reward (3D AR Asset)',
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
          id: 'starbucks',
          val: '$10',
          title: 'Starbucks',
          desc: 'eGift Card. Redeem in-store.',
          tag: 'READY',
        },
        {
          id: 'lyft',
          val: '50%',
          title: 'Lyft Ride Credit',
          desc: 'Lyft Ride Credit. Up to $10.',
          tag: 'READY',
        },
        {
          id: 'ubereats',
          val: '$15',
          title: 'Uber Eats',
          desc: 'Uber Eats Credit. Min. $20.',
          tag: 'READY',
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
  const campaignRadiusSlider = document.getElementById('campaign-radius-slider');
  const campaignRadiusVal = document.getElementById('campaign-radius-val');
  const launchCampaignBtn = document.getElementById('launch-campaign-btn');

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
  const phoneAppNavigation = document.getElementById('phone-app-navigation');
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
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    clockEl.textContent = `${hours}:${minutes}`;
  };
  setInterval(updatePhoneTime, 1000);
  updatePhoneTime();

  // Unified Dashboard Workspace Panel Navigator (Left Side Switcher)
  const switchDashboardView = (viewName) => {
    // 1. Remove active state from all header tabs
    navWorkspaceItems.forEach((btn) => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-view') === viewName) {
        btn.classList.add('active');
      }
    });

    // 2. Hide/Show appropriate dashboard sections
    viewSections.forEach((section) => {
      section.classList.remove('active');
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      }
    });

    // 3. Auto-sync Mobile Simulator Screen to corresponding view for visual storytelling
    switch (viewName) {
      case 'overview':
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

  // Wire up left Dashboard Header Navigator clicks
  navWorkspaceItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      switchDashboardView(targetView);
    });
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
      }
    });
  }

  // Helper for telemetry countup
  const animateCountUp = (element, start, end, duration) => {
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const val = Math.floor(progress * (end - start) + start);
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
      const provisioningModal = document.getElementById('campaign-provisioning-modal');
      if (provisioningModal) {
        provisioningModal.classList.add('active');
      }

      const steps = [
        document.getElementById('prov-step-1'),
        document.getElementById('prov-step-2'),
        document.getElementById('prov-step-3'),
        document.getElementById('prov-step-4')
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

            if (discoverShoeSvg) {
              discoverShoeSvg.style.opacity = '1.0';
              discoverShoeSvg.style.transform = 'scale(1.0)';
              discoverShoeSvg.classList.add('pulse-item');
            }

            setTimeout(() => {
              switchDashboardView('user-app');
            }, 500);
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
      if (phoneModalSnatched) {
        // Set success reward text based on campaign title
        if (successRewardTitle) successRewardTitle.textContent = state.campaign.title;
        if (successRewardVal) successRewardVal.textContent = '$25';
        if (successRewardSub)
          successRewardSub.textContent = 'Redeem code in physical Nike SoHo store';
        phoneModalSnatched.classList.add('active');
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
        if (walletNikeValue) walletNikeValue.textContent = '$25';
        if (walletNikeTag) {
          walletNikeTag.textContent = 'NEW';
          walletNikeTag.className = 'wallet-card-tag new';
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
      if (phoneModalSnatched) {
        if (successRewardTitle) successRewardTitle.textContent = 'Starbucks Coffee Drop';
        if (successRewardVal) successRewardVal.textContent = '$10';
        if (successRewardSub) successRewardSub.textContent = 'Campus Coffee Hunt winner reward';

        // Change code to Starbucks mock code
        const codeVal = document.querySelector('.modal-code-val');
        if (codeVal) codeVal.textContent = 'SBUX-CAMPUS-25';

        // Temporarily redefine the success wallet button callback for Starbucks card sync
        successWalletBtn.onclick = () => {
          if (phoneModalSnatched) phoneModalSnatched.classList.remove('active');

          // Switch to Wallet and make sure Starbucks card displays green tag highlight
          switchPhoneScreen('phone-screen-wallet');
          highlightPhoneTab('tab-btn-wallet');

          const starbucksCard = document.querySelector('.wallet-reward-card.green-theme');
          if (starbucksCard) {
            starbucksCard.classList.add('active-item');
            setTimeout(() => {
              starbucksCard.classList.remove('active-item');
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

      // Add XP point visual indicators
      state.player.xp += 350;

      // Spawn floating XP text floater
      const huntScreen = document.getElementById('phone-screen-hunt');
      if (huntScreen) {
        const floater = document.createElement('div');
        floater.textContent = '+350 XP';
        floater.style.position = 'absolute';
        floater.style.left = '50%';
        floater.style.bottom = '120px';
        floater.style.transform = 'translateX(-50%)';
        floater.style.fontFamily = 'var(--font-title)';
        floater.style.fontWeight = '800';
        floater.style.fontSize = '1.3rem';
        floater.style.color = 'var(--purple)';
        floater.style.textShadow = '0 0 10px var(--purple-glow)';
        floater.style.zIndex = '50';
        floater.style.pointerEvents = 'none';
        floater.style.opacity = '1';
        floater.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';

        huntScreen.appendChild(floater);
        floater.offsetHeight; // Force reflow
        floater.style.transform = 'translateX(-50%) translateY(-60px)';
        floater.style.opacity = '0';

        setTimeout(() => {
          if (floater.parentNode) floater.parentNode.removeChild(floater);
        }, 800);
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
        const levelUpModal = document.getElementById('phone-modal-levelup');
        const levelTitle = document.getElementById('levelup-level-title');
        if (levelTitle) {
          levelTitle.textContent = `Level ${state.player.level}`;
        }
        if (levelUpModal) {
          levelUpModal.classList.add('active');
        }
      } else {
        // Navigate back to profile view
        setTimeout(() => {
          switchPhoneScreen('phone-screen-profile');
          highlightPhoneTab('tab-btn-profile');
        }, 500);
      }
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
      { name: 'Michael', init: 'M', color: '#00f0ff' }
    ];

    crew.forEach((member, index) => {
      setTimeout(() => {
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
      }, (index + 1) * 800);
    });
  };

  // Scrolling Ambassador activity log ticker feed
  const initializeAmbassadorTicker = () => {
    const tickerInner = document.getElementById('ambassador-ticker-inner');
    if (!tickerInner) return;

    const activities = [
      '<span>@hunter_soho</span> snatched <span>Starbucks $10 Card</span> in SoHo',
      '<span>@alex_nyc</span> unlocked <span>Nike Sneaker Drop</span> geofence',
      '<span>@campus_king</span> joined <span>Starbucks Hunt</span> lobby',
      '<span>@snatch_master</span> level up! Now <span class="purple">Level 15 Hunter</span>',
      '<span>@brooklyn_girl</span> claimed <span class="purple">Lyft Ride Credit</span> in Williamsburg',
      '<span>@merchant_soho</span> launched a new <span>Nike SoHo Sneaker Hunt</span>',
      '<span>@nyu_hunter</span> snatched <span>Starbucks $10 Card</span> in Greenwich Village',
      '<span>@fast_hunter</span> unlocked <span class="purple">Speed Upgrade Level 3</span>',
      '<span>@soho_hustler</span> completed a <span>Quick Hunt</span> loop',
    ];

    let itemIndex = 0;
    for (let i = 0; i < 5; i++) {
      const div = document.createElement('div');
      div.className = 'ticker-log-item';
      div.innerHTML = activities[itemIndex % activities.length];
      tickerInner.appendChild(div);
      itemIndex++;
    }

    let scrollOffset = 0;
    setInterval(() => {
      const div = document.createElement('div');
      div.className = 'ticker-log-item';
      div.innerHTML = activities[itemIndex % activities.length];
      tickerInner.appendChild(div);
      itemIndex++;

      scrollOffset += 24;
      tickerInner.style.transform = `translateY(-${scrollOffset}px)`;

      if (tickerInner.children.length > 10) {
        const first = tickerInner.children[0];
        tickerInner.removeChild(first);
        scrollOffset -= 24;
        tickerInner.style.transition = 'none';
        tickerInner.style.transform = `translateY(-${scrollOffset}px)`;
        tickerInner.offsetHeight; // Force reflow
        tickerInner.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      }
    }, 2500);
  };
  initializeAmbassadorTicker();

  // Investor Auto Tour Step Controller
  class SnatchDemoTour {
    constructor() {
      this.currentStep = 0;
      this.isPlaying = false;
      this.timer = null;
      this.activeIntervals = [];
      this.steps = [
        {
          name: "Welcome to Snatch Dashboard",
          desc: "Step 1 of 9: Welcome! Exploring Snatch Workspace Dashboard",
          highlightId: "workspace-navigator",
          action: () => {
            switchDashboardView('overview');
          },
          duration: 3500
        },
        {
          name: "Define Campaign",
          desc: "Step 2 of 9: Customizing & seeding campaign drops live",
          highlightId: "campaign-title-input",
          action: () => {
            switchDashboardView('studio');
            setTimeout(() => {
              const input = document.getElementById('campaign-title-input');
              if (input) {
                const text = "Nike Air SoHo Sneaker Hunt";
                input.value = "";
                let idx = 0;
                const t = setInterval(() => {
                  if (idx < text.length) {
                    input.value += text[idx];
                    input.dispatchEvent(new Event('input'));
                    idx++;
                  } else {
                    clearInterval(t);
                  }
                }, 60);
                this.activeIntervals.push(t);
              }
            }, 400);
          },
          duration: 4500
        },
        {
          name: "Adjust Geofence Radius",
          desc: "Step 3 of 9: Adjusting proximity drop geofence scope",
          highlightId: "campaign-radius-slider",
          action: () => {
            const slider = document.getElementById('campaign-radius-slider');
            if (slider) {
              let val = 250;
              const t = setInterval(() => {
                if (val < 420) {
                  val += 15;
                  slider.value = val;
                  slider.dispatchEvent(new Event('input'));
                } else {
                  clearInterval(t);
                }
              }, 60);
              this.activeIntervals.push(t);
            }
          },
          duration: 3500
        },
        {
          name: "Deploy to Network",
          desc: "Step 4 of 9: Broadcasting geofence campaign drops",
          highlightId: "launch-campaign-btn",
          action: () => {
            const btn = document.getElementById('launch-campaign-btn');
            if (btn) btn.click();
          },
          duration: 2000
        },
        {
          name: "Live Provisioning",
          desc: "Step 5 of 9: Real-time stepper geofence registration",
          highlightId: "campaign-provisioning-modal",
          action: () => {
            // Provisioning modal runs automatically on launch click
          },
          duration: 5000
        },
        {
          name: "Player Viewfinder",
          desc: "Step 6 of 9: Switched to client-side iPhone AR tracker view",
          highlightClass: "iphone-simulator",
          action: () => {
            switchDashboardView('user-app');
          },
          duration: 4000
        },
        {
          name: "AR Approach Scan",
          desc: "Step 7 of 9: Approaching drop location within 25m threshold",
          highlightId: "approach-proximity-slider",
          action: () => {
            const slider = document.getElementById('approach-proximity-slider');
            if (slider) {
              let val = 120;
              const t = setInterval(() => {
                if (val > 20) {
                  val -= 10;
                  slider.value = val;
                  slider.dispatchEvent(new Event('input'));
                } else {
                  clearInterval(t);
                  setTimeout(() => {
                    const snatchBtn = document.getElementById('approach-snatch-trigger');
                    if (snatchBtn) snatchBtn.click();
                  }, 400);
                }
              }, 100);
              this.activeIntervals.push(t);
            }
          },
          duration: 4500
        },
        {
          name: "Claiming Rewards",
          desc: "Step 8 of 9: Synchronizing voucher code to wallet passes",
          highlightId: "phone-modal-snatched",
          action: () => {
            setTimeout(() => {
              const walletBtn = document.getElementById('success-wallet-btn');
              if (walletBtn) walletBtn.click();
            }, 1200);
          },
          duration: 4500
        },
        {
          name: "Progress & Level Up",
          desc: "Step 9 of 9: Scanning, levelling up, and upgrading perks",
          highlightClass: "iphone-simulator",
          action: () => {
            const profileTab = document.getElementById('tab-btn-profile');
            if (profileTab) profileTab.click();

            setTimeout(() => {
              const smBtn = document.getElementById('profile-enter-sm-btn');
              if (smBtn) smBtn.click();

              setTimeout(() => {
                state.player.xp = state.player.xpNext - 200;
                const shutter = document.getElementById('hunt-shutter-trigger');
                if (shutter) shutter.click();

                setTimeout(() => {
                  const claimBtn = document.getElementById('levelup-claim-btn');
                  if (claimBtn) claimBtn.click();

                  setTimeout(() => {
                    const upgradeBtn = document.getElementById('abilities-upgrade-trigger');
                    if (upgradeBtn) upgradeBtn.click();

                    setTimeout(() => {
                      this.exit();
                    }, 2500);
                  }, 1500);
                }, 2000);
              }, 1500);
            }, 1500);
          },
          duration: 12000
        }
      ];
    }

    start() {
      this.currentStep = 0;
      this.isPlaying = true;

      const hud = document.getElementById('demo-tour-hud');
      if (hud) hud.classList.add('active');

      const overlay = document.getElementById('demo-spotlight-overlay');
      if (overlay) overlay.classList.add('active');

      this.runStep();
    }

    runStep() {
      this.clearStepState();

      if (this.currentStep >= this.steps.length) {
        this.exit();
        return;
      }

      const step = this.steps[this.currentStep];

      const stepText = document.getElementById('hud-step-text');
      if (stepText) {
        stepText.textContent = step.desc;
      }

      if (step.highlightId) {
        const el = document.getElementById(step.highlightId);
        if (el) el.classList.add('highlight-element');
      } else if (step.highlightClass) {
        const el = document.querySelector('.' + step.highlightClass);
        if (el) el.classList.add('highlight-element');
      }

      step.action();

      if (this.isPlaying) {
        this.timer = setTimeout(() => {
          this.next();
        }, step.duration);
      }
    }

    next() {
      this.currentStep++;
      this.runStep();
    }

    pause() {
      this.isPlaying = false;
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;

      const pauseText = document.getElementById('hud-pause-text');
      if (pauseText) pauseText.textContent = "RESUME";

      const pauseBtn = document.getElementById('hud-pause-btn');
      if (pauseBtn) {
        pauseBtn.querySelector('svg').innerHTML = '<polygon points="5 4 19 12 5 20 5 4" fill="currentColor"/>';
      }
    }

    resume() {
      this.isPlaying = true;
      const pauseText = document.getElementById('hud-pause-text');
      if (pauseText) pauseText.textContent = "PAUSE";

      const pauseBtn = document.getElementById('hud-pause-btn');
      if (pauseBtn) {
        pauseBtn.querySelector('svg').innerHTML = '<rect x="4" y="4" width="4" height="16" fill="currentColor"/><rect x="16" y="4" width="4" height="16" fill="currentColor"/>';
      }

      const step = this.steps[this.currentStep];
      this.timer = setTimeout(() => {
        this.next();
      }, step.duration / 2);
    }

    clearStepState() {
      if (this.timer) clearTimeout(this.timer);
      this.timer = null;

      this.activeIntervals.forEach(clearInterval);
      this.activeIntervals = [];

      document.querySelectorAll('.highlight-element').forEach(el => {
        el.classList.remove('highlight-element');
      });
    }

    exit() {
      this.isPlaying = false;
      this.clearStepState();

      const hud = document.getElementById('demo-tour-hud');
      if (hud) hud.classList.remove('active');

      const overlay = document.getElementById('demo-spotlight-overlay');
      if (overlay) overlay.classList.remove('active');
    }
  }

  const tour = new SnatchDemoTour();

  const startAutoTourBtn = document.getElementById('start-auto-tour-btn');
  if (startAutoTourBtn) {
    startAutoTourBtn.addEventListener('click', () => {
      tour.start();
    });
  }

  if (startDemoBtn) {
    startDemoBtn.addEventListener('click', () => {
      tour.start();
    });
  }

  const hudPauseBtn = document.getElementById('hud-pause-btn');
  if (hudPauseBtn) {
    hudPauseBtn.addEventListener('click', () => {
      if (tour.isPlaying) {
        tour.pause();
      } else {
        tour.resume();
      }
    });
  }

  const hudSkipBtn = document.getElementById('hud-skip-btn');
  if (hudSkipBtn) {
    hudSkipBtn.addEventListener('click', () => {
      tour.next();
    });
  }

  const hudExitBtn = document.getElementById('hud-exit-btn');
  if (hudExitBtn) {
    hudExitBtn.addEventListener('click', () => {
      tour.exit();
    });
  }
});
