<template>
  <div class="profile-card" :class="[theme, status]">
    <div class="avatar-container">
      <div class="avatar">
        {{ initials }}
      </div>
      <span
        class="status-indicator"
        :class="status"
        :title="`Status: ${status}`"
      ></span>
    </div>

    <div class="details">
      <div class="name-row">
        <h3 class="user-name">{{ userName }}</h3>
        <span class="status-badge" :class="status">{{ status }}</span>
      </div>
      <p class="user-role">{{ userRole }}</p>
    </div>

    <div class="actions">
      <button
        class="signout-btn"
        @click="handleSignOut"
        title="Sign out of session"
      >
        Sign Out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    userName?: string;
    userRole?: string;
    status?: "online" | "away" | "offline";
    theme?: "light" | "dark";
  }>(),
  {
    userName: "Alex Johnson",
    userRole: "Staff Software Engineer",
    status: "online",
    theme: "light",
  },
);

const emit = defineEmits<{
  (e: "wm-signout", detail: { userName: string; timestamp: number }): void;
}>();

const initials = computed(() => {
  const parts = (props.userName || "User").trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return (props.userName || "U").slice(0, 2).toUpperCase();
});

function handleSignOut() {
  emit("wm-signout", {
    userName: props.userName,
    timestamp: Date.now(),
  });
}
</script>

<style>
:host {
  display: block;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 14px;
  background: var(--wm-bg, #ffffff);
  color: var(--wm-text, #18181b);
  border: 1px solid var(--wm-border, #e4e4e7);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05),
    0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  max-width: 440px;
}

.profile-card.dark {
  --wm-bg: #18181b;
  --wm-text: #f4f4f5;
  --wm-subtext: #a1a1aa;
  --wm-border: #27272a;
  --wm-avatar-bg: #3f3f46;
  --wm-avatar-text: #ffffff;
  --wm-btn-hover: #27272a;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}

.profile-card.light {
  --wm-bg: #ffffff;
  --wm-text: #18181b;
  --wm-subtext: #71717a;
  --wm-border: #e4e4e7;
  --wm-avatar-bg: #f4f4f5;
  --wm-avatar-text: #18181b;
  --wm-btn-hover: #f4f4f5;
}

.avatar-container {
  position: relative;
  flex-shrink: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--wm-avatar-bg, #f4f4f5);
  color: var(--wm-avatar-text, #18181b);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  border: 2px solid var(--wm-border, #e4e4e7);
  letter-spacing: 0.5px;
}

.status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: 2px solid var(--wm-bg, #ffffff);
}

.status-indicator.online,
.status-badge.online {
  background-color: #22c55e;
}

.status-indicator.away,
.status-badge.away {
  background-color: #eab308;
}

.status-indicator.offline,
.status-badge.offline {
  background-color: #94a3b8;
}

.details {
  flex-grow: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--wm-text, #18181b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  font-size: 10px;
  font-weight: 600;
  color: #ffffff;
  padding: 1px 6px;
  border-radius: 10px;
  text-transform: capitalize;
}

.user-role {
  margin: 2px 0 0 0;
  font-size: 13px;
  color: var(--wm-subtext, #71717a);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.actions {
  flex-shrink: 0;
}

.signout-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 8px;
  border: 1px solid var(--wm-border, #e4e4e7);
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.15s ease;
}

.signout-btn:hover {
  background: rgba(239, 68, 68, 0.08);
  border-color: #ef4444;
}
</style>
