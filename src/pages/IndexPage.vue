<template>
  <q-page class="bg-dark-page">
    <!-- Hero Section -->
    <div class="hero-section q-pa-xl">
      <div class="row justify-between items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-white">Hackathon Updates</h1>
          <p class="text-grey-5 q-mt-sm">Track the latest hackathon events and winners</p>
          <q-btn unelevated class="gradient-btn q-mt-md" label="Check out our updates!" size="lg" />
        </div>
        <div class="col-12 col-md-6 flex justify-center">
          <img src="https://png.pngtree.com/template/20220419/ourmid/pngtree-hackathon-background-screen-hack-synth-poster-image_1174636.jpg" class="hero-image"
            alt="Hackathon Logo" />
        </div>
      </div>
    </div>

    <!-- Admin Controls Section -->
    <section class="text-center q-py-lg">
      <q-btn
        class="gradient-btn q-px-xl"
        @click="showAddHackathonDialog = true"
        icon="add"
        label="Add Past Hackathon"
      >
        <q-tooltip>Add a completed hackathon to the archive</q-tooltip>
      </q-btn>
    </section>

    <!-- Updates Grid -->
    <div id="upcoming-hackathons" class="q-pa-xl updates-grid">
      <h2 class="text-h4 text-weight-bold text-white q-mb-lg">Recent Updates</h2>
      <div class="row q-col-gutter-xl">
        <!-- New Update Card -->
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="update-card new-update">
            <q-card-section class="text-center">
              <div class="new-update-icon q-mb-sm">
                <q-icon name="notifications" size="24px" class="text-primary" />
              </div>
              <div class="text-h6 text-weight-bold text-white q-mb-sm">Hackathon updates!</div>
              <div class="text-caption text-grey-5">
                Keep track of all the latest updates and announcements
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-for="update in updates" :key="update.title" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="update-card cursor-pointer" @click="showUpdateDetails(update)">
            <q-img :src="`/assets/${update.image}`" :ratio="1">
              <div class="update-overlay">
                <div class="text-caption text-grey-5 q-mb-xs">{{ update.date }}</div>
                <div class="text-subtitle1 text-weight-bold text-white q-mb-xs">{{ update.title }}</div>
                <div class="text-caption text-grey-5">{{ update.category }}</div>
              </div>
            </q-img>
          </q-card>
        </div>
      </div>
    </div>

    <div id="past-hackathons" class="past-hackathons q-pa-xl">
      <h2 class="text-h4 text-weight-bold text-white q-mb-xl">Past Hackathons</h2>

      <div class="row q-col-gutter-xl">
        <div v-for="hackathon in hackathonsData" :key="hackathon.id" class="col-12 q-mb-xl">
          <q-card class="hackathon-card">
            <div class="row">
              <div class="col-12 col-md-6">
                <q-carousel
                  v-model="hackathon.activeSlide"
                  arrows
                  navigation
                  infinite
                  :autoplay="3000"
                  class="hackathon-slider"
                  height="400px"
                >
                  <q-carousel-slide
                    v-for="(image, index) in hackathon.images"
                    :key="index"
                    :name="index"
                  >
                    <q-img :src="image" :ratio="16/9" style="height: 100%" />
                  </q-carousel-slide>
                </q-carousel>
              </div>

              <!-- Hackathon Information -->
              <div class="col-12 col-md-6 q-pa-md">
                <div class="text-h5 text-weight-bold text-white q-mb-sm">{{ hackathon.title }}</div>
                <div class="text-caption text-grey-5 q-mb-md">{{ formatDate(hackathon.date) }}</div>

                <div class="hackathon-meta q-mb-md">
                  <q-chip color="primary" text-color="white" icon="category">
                    {{ hackathon.category }}
                  </q-chip>
                  <q-chip color="secondary" text-color="white" icon="people">
                    {{ hackathon.participantsCount }} Participants
                  </q-chip>
                  <q-chip v-if="hackathon.location" color="accent" text-color="white" icon="location_on">
                    {{ hackathon.location }}
                  </q-chip>
                </div>

                <p class="text-body1 text-grey-4 q-mb-md">{{ hackathon.description }}</p>

                <!-- Winners Section -->
                <div class="winners-section q-mb-lg">
                  <div class="text-subtitle1 text-weight-bold text-white q-mb-sm">
                    <q-icon name="emoji_events" class="q-mr-xs" /> Winners
                  </div>
                  <div v-if="hackathon.winners && hackathon.winners.length > 0">
                    <div v-for="winner in hackathon.winners" :key="winner.position" class="winner-card q-pa-sm q-mb-sm">
                      <div class="row items-center">
                        <q-avatar size="40px" class="q-mr-md">
                          <img :src="`/assets/${winner.teamLogo}`" />
                        </q-avatar>
                        <div>
                          <div class="text-subtitle2 text-weight-bold text-white">{{ winner.teamName }}</div>
                          <div class="text-caption text-grey-5">{{ winner.position }} Place • {{ winner.prize || 'Award' }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-grey-6 q-pa-md text-center">
                    No winners have been announced yet
                  </div>

                  <q-btn
                    v-if="hackathon.canAddWinners"
                    unelevated
                    class="gradient-btn-secondary q-px-md q-mt-md"
                    @click="openAddWinnerDialog(hackathon.id)"
                  >
                    <q-icon name="add" class="q-mr-xs" /> Add Winner
                  </q-btn>
                </div>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Add Winner Dialog -->
    <q-dialog v-model="showAddWinnerDialog">
      <q-card class="add-winner-dialog">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Winner</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmitWinner" class="q-gutter-md">
            <q-input
              v-model="newWinner.teamName"
              label="Team Name"
              filled
              :rules="[val => !!val || 'Team name is required']"
            />

            <q-select
              v-model="newWinner.position"
              :options="['1st', '2nd', '3rd', 'Runner Up']"
              label="Position"
              filled
              :rules="[val => !!val || 'Position is required']"
            />

            <q-input
              v-model="newWinner.prize"
              label="Prize"
              filled
              :rules="[val => !!val || 'Prize is required']"
            />

            <q-file
              v-model="newWinner.teamLogo"
              label="Team Logo"
              filled
              accept=".jpg,.png,.svg"
              :rules="[val => !!val || 'Team logo is required']"
            >
              <template v-slot:prepend>
                <q-icon name="photo" />
              </template>
            </q-file>

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Add Winner" type="submit" unelevated class="gradient-btn" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Add Hackathon Dialog -->
    <q-dialog v-model="showAddHackathonDialog">
      <q-card class="add-hackathon-dialog">
        <q-card-section class="row items-center">
          <div class="text-h6">Add Past Hackathon</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-form @submit="onSubmitHackathon">
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="newHackathon.title"
              label="Hackathon Title"
              filled
              :rules="[val => !!val || 'Title is required']"
            />

            <q-input
              v-model="newHackathon.description"
              label="Description"
              type="textarea"
              filled
              :rules="[val => !!val || 'Description is required']"
            />

            <q-select
              v-model="newHackathon.category"
              :options="categories"
              label="Category"
              filled
              :rules="[val => !!val || 'Category is required']"
            />

            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="newHackathon.date"
                  label="Event Date"
                  filled
                  type="date"
                  :rules="[val => !!val || 'Date is required']"
                />
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="newHackathon.location"
                  label="Location"
                  filled
                  :rules="[val => !!val || 'Location is required']"
                />
              </div>
            </div>

            <q-input
              v-model.number="newHackathon.participantsCount"
              label="Number of Participants"
              type="number"
              filled
              :rules="[
                val => !!val || 'Participants count is required',
                val => val > 0 || 'Must be greater than 0'
              ]"
            />

            <q-file
              v-model="newHackathon.images"
              label="Upload Images"
              filled
              multiple
              accept="image/*"
              :rules="[val => val?.length > 0 || 'At least one image is required']"
            >
              <template v-slot:prepend>
                <q-icon name="photo_library" />
              </template>
            </q-file>
          </q-card-section>

          <q-card-actions align="right" class="q-pa-md">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn
              type="submit"
              class="gradient-btn"
              label="Add Hackathon"
            />
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Update Details Dialog -->
    <q-dialog v-model="showUpdateDetailsDialog">
      <q-card class="update-details-dialog">
        <q-img v-if="selectedUpdate" :src="`/assets/${selectedUpdate.image}`" :ratio="16/9">
          <div class="absolute-bottom text-subtitle2 text-center q-pa-sm bg-dark-page-transparent">
            {{ selectedUpdate?.title }}
          </div>
        </q-img>
        <q-card-section v-if="selectedUpdate">
          <div class="text-h6 text-weight-bold q-mb-sm">{{ selectedUpdate.title }}</div>
          <div class="text-caption text-grey-7 q-mb-md">
            <q-icon name="event" size="xs" class="q-mr-xs" /> {{ selectedUpdate.date }} &nbsp;
            <q-icon name="label" size="xs" class="q-mr-xs" /> {{ selectedUpdate.category }}
          </div>
          <p>This is a detailed view of the {{ selectedUpdate.title }} update. More information about this update will be displayed here.</p>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { onMounted, ref } from "vue";

// Data references
const hackathonsData = ref([]);
const showAddWinnerDialog = ref(false);
const showAddHackathonDialog = ref(false); // Add this line to fix the error
const selectedHackathonId = ref(null);
const showUpdateDetailsDialog = ref(false);
const selectedUpdate = ref(null);

// Form data
const newWinner = ref({
  teamName: '',
  position: '',
  prize: '',
  teamLogo: null
});

const newHackathon = ref({
  title: '',
  description: '',
  category: '',
  date: '',
  location: '',
  participantsCount: null,
  images: []
});

// Firestore data loading
async function loadHackathonsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "hackathons"));
    const hackathons = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        activeSlide: 0
      };
    });

    // Merge with our local data
    const combinedHackathons = [...hackathons];

    // Add initial sample hackathon if no data exists
    if (combinedHackathons.length === 0) {
      combinedHackathons.push(...sampleHackathons.value);
    }

    hackathonsData.value = combinedHackathons;
    console.log("Hackathons loaded successfully:", hackathonsData.value.length);
  } catch (error) {
    console.error("Error loading hackathons: ", error);
    // Fallback to sample data on error
    hackathonsData.value = sampleHackathons.value;
  }
}

// Format date helper
function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Dialog handlers
function openAddWinnerDialog(hackathonId) {
  selectedHackathonId.value = hackathonId;
  showAddWinnerDialog.value = true;
}

function showUpdateDetails(update) {
  selectedUpdate.value = update;
  showUpdateDetailsDialog.value = true;
}

// Form submissions
function onSubmitWinner() {
  const hackathon = hackathonsData.value.find(h => h.id === selectedHackathonId.value);
  if (hackathon) {
    if (!hackathon.winners) {
      hackathon.winners = [];
    }

    hackathon.winners.push({
      teamName: newWinner.value.teamName,
      position: newWinner.value.position,
      prize: newWinner.value.prize,
      teamLogo: URL.createObjectURL(newWinner.value.teamLogo)
    });

    // You might want to update Firestore here
    console.log("Winner added:", newWinner.value.teamName);
  }

  // Reset form
  newWinner.value = {
    teamName: '',
    position: '',
    prize: '',
    teamLogo: null
  };
  showAddWinnerDialog.value = false;
}

async function onSubmitHackathon() {
  // Create image URLs
  const imageUrls = newHackathon.value.images ?
    Array.from(newHackathon.value.images).map((file) => URL.createObjectURL(file)) :
    [];

  const hackathonData = {
    ...newHackathon.value,
    images: imageUrls,
    id: Date.now(),
    status: "completed",
    winners: [],
    activeSlide: 0,
    canAddWinners: true
  };

  // Save to Firestore
  try {
    const docRef = await addDoc(collection(db, "hackathons"), hackathonData);
    console.log("Hackathon added to Firestore with ID:", docRef.id);

    // Update local state
    hackathonsData.value.push(hackathonData);

    // Show success notification
    // q-notify({ type: 'positive', message: 'Hackathon added successfully!' });
  } catch (error) {
    console.error("Error adding hackathon: ", error);
    // Show error notification
    // q-notify({ type: 'negative', message: 'Failed to add hackathon' });
  }

  // Reset form
  newHackathon.value = {
    title: '',
    description: '',
    category: '',
    date: '',
    location: '',
    participantsCount: null,
    images: []
  };
  showAddHackathonDialog.value = false;
}

// Sample data
// Import your images at the top of the script
import hackathonImage1 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.23.jpeg';
import hackathonImage2 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.24 (1).jpeg';
import hackathonImage3 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.24.jpeg';
import teamLogo1 from 'src/assets/WhatsApp Image 2024-08-30 at 22.32.46.jpeg';

const updates = ref([
  {
    title: 'Nano Lens Explorer',
    image: 'lens.jpg',
    category: 'Product News',
    date: 'Apr 17, 2023',
  },
  {
    title: 'Desert Explorer',
    image: 'desert.jpg',
    category: 'AI Vision',
    date: 'Apr 17, 2023',
  },
  {
    title: 'Social Media Explorer',
    image: 'social.jpg',
    category: 'Tech News',
    date: 'Apr 17, 2023',
  },
  {
    title: 'Crypto Explorer',
    image: 'crypto.jpg',
    category: 'Finance',
    date: 'Apr 17, 2023',
  },
]);

const sampleHackathons = ref([
  {
    id: 1,
    title: 'SMART INDIA HACKATHON 2024',
    description: 'The Smart India Hackathon (SIH) is a nationwide initiative by the Government of India to encourage innovation, problem-solving, and technological development among students. It provides a platform for young minds to solve real-world challenges faced by various government departments, industries, and organizations.',
    category: 'AI & Machine Learning',
    date: '2024-12-11',
    location: 'New Delhi, India',
    participantsCount: 20,
    images: [hackathonImage1, hackathonImage2, hackathonImage3],
    activeSlide: 0,
    canAddWinners: true,
    winners: [
      {
        teamName: 'BYTE_KNIGHTS',
        position: '2ND',
        prize: 'Special Recognition Award',
        teamLogo: teamLogo1
      },
    ]
  },
]);

const categories = [
  'AI & Machine Learning',
  'Web Development',
  'Mobile Apps',
  'Blockchain',
  'Game Development',
  'IoT',
  'Cybersecurity',
  'Data Science',
  'Cloud Computing',
  'AR/VR'
];

// Initialize data on component mount
onMounted(() => {
  loadHackathonsFromFirestore();
});
</script>

<style lang="scss" scoped>
.bg-dark-page {
  background-color: #121212;
  min-height: 100vh;
}

.bg-dark-page-transparent {
  background-color: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(5px);
}

.hero-section {
  min-height: 40vh;
  position: relative;
  background: linear-gradient(150deg, #1a1a2e 0%, #16213e 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.hero-image {
  width: 320px;
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 0 15px rgba(73, 69, 255, 0.3));
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.gradient-btn {
  background: linear-gradient(45deg, #4945ff, #9747ff);
  border-radius: 25px;
  padding: 12px 32px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(73, 69, 255, 0.4);
  }
}

.updates-grid {
  position: relative;
  z-index: 1;
  margin-top: 20px;
}

.update-card {
  background: rgba(30, 30, 46, 0.7);
  border: 1px solid rgba(73, 69, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    border-color: rgba(73, 69, 255, 0.5);
  }

  &.new-update {
    background: rgba(24, 24, 35, 0.7);
    border: 2px dashed rgba(73, 69, 255, 0.4);

    .new-update-icon {
      width: 48px;
      height: 48px;
      background: rgba(73, 69, 255, 0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
    }
  }
}

.update-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background: rgba(14, 12, 42, 0.8);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  height: 30%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .update-card:hover & {
    height: 100%;
    justify-content: center;
    align-items: center;
  }
}

.past-hackathons {
  background: linear-gradient(180deg, transparent 0%, rgba(20, 20, 30, 0.5) 100%);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 5%;
    right: 5%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(73, 69, 255, 0.3), transparent);
  }
}

.hackathon-card {
  background: rgba(30, 30, 46, 0.7);
  border: 1px solid rgba(73, 69, 255, 0.2);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    border-color: rgba(73, 69, 255, 0.4);
  }
}

.hackathon-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hackathon-slider {
  border-radius: 16px 0 0 16px;
  overflow: hidden;

  .q-carousel__slide {
    padding: 0;
  }
}

.winner-card {
  background: rgba(73, 69, 255, 0.1);
  border: 1px solid rgba(73, 69, 255, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    background: rgba(73, 69, 255, 0.15);
  }
}

.gradient-btn-secondary {
  background: linear-gradient(45deg, rgba(73, 69, 255, 0.1), rgba(151, 71, 255, 0.1));
  border: 1px solid #4945ff;
  color: #4945ff;
  border-radius: 25px;
  padding: 8px 24px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(45deg, rgba(73, 69, 255, 0.2), rgba(151, 71, 255, 0.2));
    transform: translateY(-2px);
  }
}

.add-winner-dialog, .update-details-dialog {
  width: 400px;
  max-width: 90vw;
  background: #1e1e2e;
  color: white;
  border-radius: 16px;
  border: 1px solid rgba(73, 69, 255, 0.3);
}

.add-hackathon-dialog {
  min-width: 500px;
  max-width: 90vw;
  background: #1e1e2e;
  color: white;
  border: 1px solid rgba(73, 69, 255, 0.3);
  border-radius: 16px;
}

.text-center {
  position: relative;
  z-index: 1;
}

@media (max-width: 767px) {
  .hackathon-slider {
    border-radius: 16px 16px 0 0;
  }

  .hero-section {
    text-align: center;
  }

  .hackathon-meta {
    justify-content: center;
  }
}
</style>