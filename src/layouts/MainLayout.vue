<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-dark-page q-py-sm">
      <q-toolbar>
        <div class="q-px-lg row full-width items-center justify-between">
          <div class="row items-center">
            <q-avatar square size="70px">
              <img src="src/assets/logo (1).png" alt="Logo" />
            </q-avatar>
            <div class="hacathor-container q-ml-xl">
              <span span class="thor">HACAthor</span>
            </div>
          </div>

          <div class="row items-center q-gutter-x-lg">
            <q-btn flat class="nav-btn q-px-md" @click="scrollToSection('past-hackathons')">
              <div class="column items-center">
                <span class="text-subtitle1 text-weight-medium">Past Events</span>
              </div>
            </q-btn>

            <q-btn
              unelevated
              class="gradient-btn"
              label="Upcoming Events"
              icon-right="arrow_forward"
              @click="scrollToSection('upcoming-hackathons')"
            />
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
const scrollToSection = (sectionId) => {
  // Only scroll if we're on the index page
  if (window.location.hash === '#/' || window.location.hash === '') {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  } else {
    // If not on index page, navigate to index and then scroll
    window.location.href = '/#/'
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }
}
</script>

<style lang="scss" scoped>
.gradient-btn {
  background: linear-gradient(45deg, $gradient-start, $gradient-end);
  border-radius: 25px;
  padding: 8px 24px;
  font-weight: 500;
}

.nav-btn {
  padding: 4px 16px;
  min-height: 52px;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &.q-router-link-active {
    background: rgba($primary, 0.15);

    .text-subtitle1 {
      color: $primary;
    }
  }
}

.hacathor-container {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  padding: 0.2em 0;
  display: inline-block;
  width: auto;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    letter-spacing: 2px;

    .haca,
    .thor {
      text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
}

.haca {
  background: linear-gradient(to right, $gradient-start, $gradient-start);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.thor {
  background: linear-gradient(to right, $gradient-end, $gradient-end);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.q-avatar {
  transition: all 0.3s ease;
  &:hover {
    filter: drop-shadow(0 0 8px rgba(73, 69, 255, 0.6));
  }
}
</style>
