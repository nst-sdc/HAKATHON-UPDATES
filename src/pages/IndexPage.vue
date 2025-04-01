<template>
  <q-page class="bg-dark-page">
    <!-- Hero Section -->
    <div class="hero-section q-pa-xl">
      <div class="row justify-between items-center">
        <div class="col-12 col-md-6">
          <h1 class="text-h2 text-weight-bold text-white">Hacathon Updates</h1>
          <q-btn unelevated class="gradient-btn q-mt-md" label="Check out our updates!" size="lg" />
        </div>
        <div class="col-12 col-md-6 flex ">
          <img src="src/assets/Black_White_Retro_Y2K_Streetwear_Star_Logo-removebg-preview.png" class="hero-image"
          />
        </div>
      </div>
    </div>

    <section class="text-center q-py-lg">
      <q-btn
        class="gradient-btn q-px-xl"
        @click="openAddHackathonDialog"
        icon="add"
        label="Add Past Hackathon"
      >
        <q-tooltip>Add a completed hackathon to the archive</q-tooltip>
      </q-btn>
    </section>

    <!-- Updates Grid -->
    <div id="upcoming-hackathons" class="q-pa-xl updates-grid">
      <div class="row q-col-gutter-xl">
        <!-- New Update Card -->
        <div class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="update-card new-update">
            <q-card-section class="text-center">
              <div class="new-update-icon q-mb-sm">
                <q-icon name="add" size="24px" class="text-primary" />
              </div>
              <div class="text-h6 text-weight-bold text-white q-mb-sm">Hacathon updates!</div>
              <div class="text-caption text-grey-5">
                Keep track of all the latest updates and announcements
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div v-for="update in updates" :key="update.title" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card class="update-card">
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
        <div v-for="hackathon in pastHackathons" :key="hackathon.id" class="col-12 q-mb-xl">
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
                >
                  <q-carousel-slide
                    v-for="(image, index) in hackathon.images"
                    :key="index"
                    :name="index"
                  >
                    <q-img :src="image" :ratio="16/9" />
                  </q-carousel-slide>
                </q-carousel>
              </div>

              <!-- Hackathon Information -->
              <div class="col-12 col-md-6 q-pa-md">
                <div class="text-h5 text-weight-bold text-white q-mb-sm">{{ hackathon.title }}</div>
                <div class="text-caption text-grey-5 q-mb-md">{{ hackathon.date }}</div>
                <p class="text-body1 text-grey-4 q-mb-md">{{ hackathon.description }}</p>

                <!-- Winners Section -->
                <div class="winners-section q-mb-lg">
                  <div class="text-subtitle1 text-weight-bold text-white q-mb-sm">Winners</div>
                  <div v-for="winner in hackathon.winners" :key="winner.position" class="winner-card q-pa-sm q-mb-sm">
                    <div class="row items-center">
                      <q-avatar size="40px" class="q-mr-md">
                        <img :src="`/assets/${winner.teamLogo}`" />
                      </q-avatar>
                      <div>
                        <div class="text-subtitle2 text-weight-bold text-white">{{ winner.teamName }}</div>
                        <div class="text-caption text-grey-5">{{ winner.position }} Place • {{ winner.prize }}</div>
                      </div>
                    </div>
                  </div>
                </div>


                <q-btn
                  v-if="hackathon.canAddWinners"
                  unelevated
                  class="gradient-btn-secondary q-px-md"
                  @click="openAddWinnerDialog(hackathon.id)"
                >
                  Add Winner
                </q-btn>
              </div>
            </div>
          </q-card>
        </div>
      </div>
    </div>

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
            />

            <div class="row justify-end q-mt-md">
              <q-btn label="Cancel" flat v-close-popup class="q-mr-sm" />
              <q-btn label="Add Winner" type="submit" unelevated class="gradient-btn" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

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
  </q-page>
</template>

<script setup>
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the path to your firebase.js file
import { onMounted, ref } from "vue";

async function loadHackathonsFromFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, "hackathons"));
    pastHackathons.value = querySnapshot.docs.map((doc) => doc.data());
    console.log("Hackathons loaded from Firestore!");
  } catch (error) {
    console.error("Error loading hackathons: ", error);
  }
}
// Call this function when the app initializes
onMounted(() => {
  loadHackathonsFromFirestore();
});



// Import your images at the top of the script
import hackathonImage1 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.23.jpeg'  // adjust filename to match your actual file
import hackathonImage2 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.24 (1).jpeg'  // adjust filename to match your actual file
import hackathonImage3 from 'src/assets/WhatsApp Image 2025-02-16 at 22.18.24.jpeg'  // adjust filename to match your actual file
import teamLogo1 from 'src/assets/WhatsApp Image 2024-08-30 at 22.32.46.jpeg'
const updates = ref([
  {
    title: 'Nano Lens Explorer',
    image: 'lens.jpg',
    category: 'Product News',
    date: 'GD 17/04/23',
  },
  {
    title: 'Desert Explorer',
    image: 'desert.jpg',
    category: 'AI Vision',
    date: 'GD 17/04/23',
  },
  {
    title: 'Social Media Explorer',
    image: 'social.jpg',
    category: 'Tech News',
    date: 'GD 17/04/23',
  },
  {
    title: 'Crypto Explorer',
    image: 'crypto.jpg',
    category: 'Finance',
    date: 'GD 17/04/23',
  },
])

const pastHackathons = ref([
  {
    id: 1,
    title: 'SMART INDIA HAKATHON 2024',
    description: 'The Smart India Hackathon (SIH) is a nationwide initiative by the Government of India to encourage innovation, problem-solving, and technological development among students. It provides a platform for young minds to solve real-world challenges faced by various government departments, industries, and organizations.',
    category: 'AI & Machine Learning',
    date: '2024-12-11',
    participantsCount: 20,
    images: [hackathonImage1, hackathonImage2,hackathonImage3],  // Use imported images
    activeSlide: 0,
    canAddWinners: true,
    winners: [
      {
        teamName: 'BYTE_KNIGHTS',
        position: '2ND',
        prize: '',
        teamLogo: teamLogo1
      },

    ]
  },

])

const showAddWinnerDialog = ref(false)
const selectedHackathonId = ref(null)
const newWinner = ref({
  teamName: '',
  position: '',
  prize: '',
  teamLogo: null
})

function openAddWinnerDialog(hackathonId) {
  selectedHackathonId.value = hackathonId
  showAddWinnerDialog.value = true
}

function onSubmitWinner() {

  const hackathon = pastHackathons.value.find(h => h.id === selectedHackathonId.value)
  if (hackathon) {
    hackathon.winners.push({
      teamName: newWinner.value.teamName,
      position: newWinner.value.position,
      prize: newWinner.value.prize,
      teamLogo: URL.createObjectURL(newWinner.value.teamLogo)
    })
  }

  newWinner.value = {
    teamName: '',
    position: '',
    prize: '',
    teamLogo: null
  }
  showAddWinnerDialog.value = false
}

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
]

const showAddHackathonDialog = ref(false)
const newHackathon = ref({
  title: '',
  description: '',
  category: '',
  date: '',
  location: '',
  participantsCount: null,
  images: []
})

function openAddHackathonDialog() {
  showAddHackathonDialog.value = true
}



async function onSubmitHackathon() {
  const imageUrls = Array.from(newHackathon.value.images).map((file) =>
    URL.createObjectURL(file)
  );

  const hackathonData = {
    ...newHackathon.value,
    images: imageUrls,
    id: Date.now(),
    status: "completed",
    winners: [],
  };

  // Save to Firestore
  try {
    await addDoc(collection(db, "hackathons"), hackathonData);
    console.log("Hackathon added to Firestore!");
  } catch (error) {
    console.error("Error adding hackathon: ", error);
  }

  pastHackathons.value.push(hackathonData);

  newHackathon.value = {
    title: "",
    description: "",
    category: "",
    date: "",
    location: "",
    participantsCount: null,
    images: [],
  };
  showAddHackathonDialog.value = false;
}
</script>

<style lang="scss" scoped>
.hero-section {
  min-height: 40vh;
  position: relative;
}

.hero-image {
  width: 400px;
  max-width: 100%;
  height: auto;
}

.gradient-btn {
  background: linear-gradient(45deg, $gradient-start, $gradient-end);
  border-radius: 25px;
  padding: 12px 32px;
  font-weight: 500;
}

.updates-grid {
  margin-top: -40px;
}

.update-card {
  background: $card-bg;
  border: 1px solid $card-border;
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  backdrop-filter: blur(10px);

  &.new-update {
    background: $card-new-bg;
    border: 2px dashed $card-new-border;

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
}

.past-hackathons {
  background: linear-gradient(180deg, transparent 0%, rgba($dark, 0.5) 100%);
}

.hackathon-card {
  background: $card-bg;
  border: 1px solid $card-border;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.hackathon-slider {
  height: 400px;

  .q-carousel__slide {
    padding: 0;
  }
}

.winner-card {
  background: rgba($primary, 0.1);
  border: 1px solid rgba($primary, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(8px);
    background: rgba($primary, 0.15);
  }
}

.gradient-btn-secondary {
  background: linear-gradient(45deg, rgba($gradient-start, 0.1), rgba($gradient-end, 0.1));
  border: 1px solid $gradient-start;
  color: $gradient-start;
  border-radius: 25px;
  padding: 8px 24px;
  font-weight: 500;

  &:hover {
    background: linear-gradient(45deg, rgba($gradient-start, 0.2), rgba($gradient-end, 0.2));
  }
}

.add-winner-dialog {
  width: 400px;
  max-width: 90vw;
  background: $dark;
  color: white;
}

.add-hackathon-dialog {
  min-width: 500px;
  max-width: 90vw;
  background: $card-bg;
  border: 1px solid $card-border;
}

.gradient-btn {
  background: linear-gradient(45deg, $gradient-start, $gradient-end);

  &:hover {
    opacity: 0.9;
  }
}

.text-center {
  position: relative;
  z-index: 1;
  margin: -20px 0 20px;
}

.hackathon-card {
  background: $card-bg;
  border: 1px solid $card-border;
  transition: all 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
}

.hackathon-image-slide {
  padding: 0;
}

.hackathon-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  object-position: center;
}
</style>
