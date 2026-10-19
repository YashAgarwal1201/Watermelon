// File: wc-vue-app/src/main.ts

import { defineCustomElement } from "vue";
import UserProfileCe from "./UserProfile.ce.vue";

export const WmUserProfileElement = defineCustomElement(UserProfileCe);

// Register the custom element if not already registered
if (!customElements.get("wm-user-profile")) {
  customElements.define("wm-user-profile", WmUserProfileElement);
}

export { UserProfileCe };
