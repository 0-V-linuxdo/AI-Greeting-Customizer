// ==UserScript==
// @name                 [Gemini] Greeting Customizer [20260325] v1.0.0
// @name:zh-CN           [Gemini] 问候语自定义 [20260325] v1.0.0
// @namespace            https://github.com/0-V-linuxdo/AI-Greeting-Customizer
// @description          Customize Gemini home greetings! Supports hiding usernames, multiple text management, and random/sequential rotation.
// @description:zh-CN    自定义 Gemini 首页问候语！支持隐藏用户名、多文案管理、随机/顺序轮播以及点击/定时切换。
// @version              [20260325] v1.0.0
// @update-log           [20260325] v1.0.0 迁移核心代码至统一仓库 (AI-Greeting-Customizer)，优化脚本资源加载与后续维护稳定性。
// @match                https://gemini.google.com/*
// @require              https://github.com/0-V-linuxdo/AI-Greeting-Customizer/raw/refs/heads/main/core/greeting-core.js
// @grant                GM_addStyle
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_registerMenuCommand
// @run-at               document-start
// ==/UserScript==

(function () {
    'use strict';

    const SELECTOR_USERNAME = 'div[data-test-id="greeting-title"]';

    GreetingCustomizer({
        // ---- CSS 选择器 ----
        selectorText: 'h1[data-test-id="message"] .message-text',
        selectorH1:   'h1[data-test-id="message"]',

        // ---- GM 存储 key ----
        keyGreetings: 'gemini_greetings_v1',
        keySettings:  'gemini_settings_v1',
        keyState:     'gemini_state_v1',

        // ---- 首页判断 ----
        isHome: () => location.pathname === '/app' || location.pathname === '/' || location.pathname === '',

        // ---- Gemini：DOM 频繁重建，需全局 flag 防重复 advance ----
        useGlobalRefreshGuard: true,

        // ---- 默认设置扩展：hideUsername ----
        defaultSettings: {
            hideUsername: true
        },

        // ---- 扩展 I18N ----
        extraI18N: {
            zh: {
                hideUsernameLabel: '屏蔽用户名（问候语）',
                hideUsernameHint: '隐藏头部类似 "Hi UserName" 的问候文字，刷新页面生效'
            },
            en: {
                hideUsernameLabel: 'Hide Username Greeting',
                hideUsernameHint: 'Hide the "Hi UserName" text at the top, refresh to apply'
            }
        },

        // ---- CSS 生成（只修改字体大小，不动字体） ----
        buildGreetingCss: (selectorText, selectorH1, escapedContent, settings, manualClickable) => `
            /* 如果开启屏蔽用户名 */
            ${settings.hideUsername ? `
            ${SELECTOR_USERNAME} {
              display: none !important;
            }
            ` : ''}

            /* 隐藏原始文本节点，但保留容器占位 */
            ${selectorH1} .message-text {
              font-size: 0 !important;
              line-height: 0 !important;
              visibility: hidden !important;
              display: block !important;
            }

            /* 注入伪元素显示新文字 */
            ${selectorH1} .message-text::before {
              content: "${escapedContent}";

              display: block !important;
              visibility: visible !important;
              font-size: 2.25rem !important;
              line-height: 1.4 !important;

              white-space: pre-wrap !important;
              text-align: center !important;
              width: 100% !important;

              margin: 0 auto !important;
              padding: 0 !important;
            }

            ${manualClickable ? `
            ${selectorH1} {
              cursor: pointer !important;
              user-select: none !important;
            }` : ''}

            @media (max-width: 768px) {
              ${selectorH1} .message-text::before {
                font-size: 1.5rem !important;
                line-height: 1.3 !important;
              }
            }
        `,

        // ---- 设置面板扩展：hideUsername 复选框 ----
        onBuildSettingsUI: (rightCard, settings, persist, t) => {
            const rowHideUser = document.createElement('div');
            rowHideUser.className = 'gc-row';
            rowHideUser.style.marginTop = '8px';

            const hideUserLabel = document.createElement('label');
            hideUserLabel.className = 'gc-label';
            hideUserLabel.style.display = 'flex';
            hideUserLabel.style.alignItems = 'center';
            hideUserLabel.style.gap = '8px';
            hideUserLabel.style.cursor = 'pointer';

            const chkHideUser = document.createElement('input');
            chkHideUser.type = 'checkbox';
            chkHideUser.checked = settings.hideUsername;
            chkHideUser.addEventListener('change', persist);

            hideUserLabel.appendChild(chkHideUser);
            hideUserLabel.appendChild(document.createTextNode(t('hideUsernameLabel')));
            rowHideUser.appendChild(hideUserLabel);

            rightCard.appendChild(rowHideUser);

            // 返回 extraUIState，供 onPersistSettings 读取
            return { chkHideUser };
        },

        // ---- 序列化设置时合入 hideUsername ----
        onPersistSettings: (base, extraUI) => ({
            ...base,
            hideUsername: extraUI.chkHideUser ? extraUI.chkHideUser.checked : true
        })
    });
})();
