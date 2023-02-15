<template>
  <q-page class="relative-position">
    <q-scroll-area class="full-width full-height absolute">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newQweetContent"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
            class="new-qweet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet()"
            unelevated
            rounded
            class="q-mb-lg"
            color="primary"
            label="Qweet"
            no-caps
            :disable="!newQweetContent"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider" />
      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item class="q-py-md" v-for="qweet in qweets" :key="qweet.id">
            <q-item-section avatar top>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Whoopty Woo</strong
                ><span class="text-grey-7">
                  @whoopty_woo <br class="lt-md" />&bull;
                  {{ relativeDate(qweet.date) }}</span
                ></q-item-label
              >
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="row justify-between q-mt-sm qweet-icons">
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="far fa-comment"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-retweet"
                  size="sm"
                />
                <q-btn
                  flat
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  size="sm"
                  @click="likeQweet(qweet)"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  icon="fas fa-trash"
                  size="sm"
                  @click="deleteQweet(qweet)"
                />
              </div>
            </q-item-section>

            <!-- <q-item-section side top>
              {{ relativeDate(qweet.date) }}
            </q-item-section> -->
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { formatDistance } from "date-fns";
import db from "../boot/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
// import { getHeapCodeStatistics } from "v8";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [],
    };
  },
  methods: {
    relativeDate(value) {
      // return value
      return formatDistance(value, new Date()) + " ago";
    },
    async addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false
      };
      // this.qweets.unshift(newQweet);
      // db.collection('qweets').add(newQweet)
      const docRef = await addDoc(collection(db, "qweets"), newQweet);
      console.log("Document written with ID: ", docRef.id);
      this.newQweetContent = "";
    },
    deleteQweet(qweet) {
      const docRef = doc(db, "qweets", qweet.id);
      deleteDoc(docRef).then(function () {
        console.log("Document successfully deleted");
      });
    },
    likeQweet(qweet) {
      const docRef = doc(db, "qweets", qweet.id);
      updateDoc(docRef, {
        liked: !qweet.liked,
      }).then(function () {
        console.log("Document successfully updated");
      });
    },
  },
  mounted() {
    const q = query(collection(db, "qweets"), orderBy("date"));
    onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        let qweetChange = change.doc.data();
        qweetChange.id = change.doc.id;
        if (change.type === "added") {
          console.log("New qweet: ", qweetChange);
          this.qweets.unshift(qweetChange);
        }
        if (change.type === "modified") {
          console.log("Modified qweet: ", qweetChange);
          let index = this.qweets.findIndex(
            (qweet) => qweet.id === qweetChange.id
          );
          Object.assign(this.qweets[index], qweetChange)
        }
        if (change.type === "removed") {
          let index = this.qweets.findIndex(
            (qweet) => qweet.id === qweetChange.id
          );
          this.qweets.splice(index, 1);
        }
      });
    });
  },
});
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
    border-top: 1px solid
    border-bottom: 1px solid
    border-color: $grey-4
.qweet-content
    white-space: pre-line
.qweet-icons
    margin-left: -5px
</style>
