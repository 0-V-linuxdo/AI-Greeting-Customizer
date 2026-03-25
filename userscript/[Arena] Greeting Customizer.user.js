// ==UserScript==
// @name                 [Arena] Greeting Customizer [20260325] v1.0.0
// @name:zh-CN           [Arena] 问候语自定义 [20260325] v1.0.0
// @namespace            https://github.com/0-V-linuxdo/AI-Greeting-Customizer
// @description          Personalize Arena home greetings! Supports multiple greeting rotation, manual clicking, or automatic interval switching.
// @description:zh-CN    自定义 Arena 首页问候语！支持多句文案轮播、点击切换或定时自动切换，打造专属的 AI 欢迎语。
// @version              [20260325] v1.0.0
// @update-log           [20260325] v1.0.0 迁移核心代码至统一仓库 (AI-Greeting-Customizer)，优化脚本资源加载与后续维护稳定性。
// @match                https://arena.ai/*
// @require              https://github.com/0-V-linuxdo/AI-Greeting-Customizer/raw/refs/heads/main/core/greeting-core.js
// @grant                GM_addStyle
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_registerMenuCommand
// @run-at               document-start
// ==/UserScript==

(function () {
    'use strict';

    GreetingCustomizer({
        // ---- CSS 选择器 ----
        selectorText: 'h1',
        selectorH1:   'h1',

        // ---- GM 存储 key ----
        keyGreetings: 'gc_greetings_arena_v1',
        keySettings:  'gc_settings_arena_v1',
        keyState:     'gc_state_arena_v1',

        // ---- 首页判断 ----
        isHome: () => location.pathname === '/' || location.pathname.startsWith('/text/'),

        // ---- CSS 生成（只修改字体大小，不动字体） ----
        buildGreetingCss: (selectorText, selectorH1, escapedContent, settings, manualClickable) => `
            /* 隐藏原始文本节点，但保留容器占位 */
            ${selectorH1} {
              font-size: 0 !important;
              line-height: 0 !important;
              visibility: hidden !important;
              display: block !important;
            }

            /* 注入伪元素显示新文字 */
            ${selectorH1}::before {
              content: "${escapedContent}";

              display: block !important;
              visibility: visible !important;
              font-size: 28px !important;
              line-height: 1.4 !important;
              font-weight: 300 !important;
              color: currentColor !important;

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

            @media (min-width: 640px) {
              ${selectorH1}::before {
                font-size: 32px !important;
              }
            }
        `
    });
})();
