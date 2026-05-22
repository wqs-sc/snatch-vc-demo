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

  // Campaign Launch Sync Event Trigger
  if (launchCampaignBtn) {
    launchCampaignBtn.addEventListener('click', () => {
      // 1. Play phone camera screen flash overlay
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

      // 2. Set campaign state to active
      state.campaign.active = true;

      // 3. Update SaaS dashboard header and table database statuses
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

      // 4. Update Mobile Simulator Hunts View (Unlock the Nike Drop)
      if (discoverUnlaunchedMsg) discoverUnlaunchedMsg.style.display = 'none';
      if (discoverShutterRow) discoverShutterRow.style.display = 'flex';
      if (discoverRadarPreview) discoverRadarPreview.style.display = 'block';

      if (discoverShoeSvg) {
        discoverShoeSvg.style.opacity = '1.0';
        discoverShoeSvg.style.transform = 'scale(1.0)';
        // Trigger bounce glow effect
        discoverShoeSvg.classList.add('pulse-item');
      }

      // 5. Shift left dashboard view to "User App" walk-through to guide next manual steps
      setTimeout(() => {
        switchDashboardView('user-app');
      }, 500);
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
      if (qhPlayerProximitySlider) qhPlayerProximitySlider.value = 110;
      if (qhPlayerProximityText) qhPlayerProximityText.textContent = '110m';
      updateQHPlayerButton(110);
      switchPhoneScreen('phone-screen-qh-player');
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
      if (state.player.xp >= state.player.xpNext) {
        state.player.level += 1;
        state.player.xp = state.player.xp - state.player.xpNext;
        alert(`LEVEL UP! You are now Level ${state.player.level}!`);
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

      // Navigate back to profile view
      setTimeout(() => {
        switchPhoneScreen('phone-screen-profile');
        highlightPhoneTab('tab-btn-profile');
      }, 500);
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

        setTimeout(() => {
          abilitiesUpgradeTrigger.textContent = 'UPGRADE ABILITIES';
          abilitiesUpgradeTrigger.style.background = 'var(--lime)';
          abilitiesUpgradeTrigger.style.color = 'var(--text-dark)';
          abilitiesUpgradeTrigger.style.boxShadow = '0 4px 15px rgba(173, 255, 47, 0.3)';
        }, 2000);
      } else {
        alert('Insufficient Ability Points! Earn more points by scanning Soho.');
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
});
