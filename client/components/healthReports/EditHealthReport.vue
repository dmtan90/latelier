<template>
  <div class="edit-health-report">
    <generic-dialog
      v-model="showDialog"
      :title="$t('Edit report')"
      max-width="800px"
    >
      <template v-slot:content>
        <select-date
          v-model="showSelectDate"
          :disable-time="true"
          @select="onSelectDate"
        />

        <v-form v-model="valid" @submit.prevent>
          <v-layout wrap>
            <v-flex xs12>
              <v-text-field
                v-model="name"
                :rules="nameRules"
                :label="$t('Name')"
                required
              />
            </v-flex>
            <v-flex xs12>
              <v-list two-line class="elevation-1 date">
                <v-list-item @click="showSelectDate = true">
                  <v-list-item-avatar>
                    <v-icon>mdi-calendar-today</v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ $t("Date") }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <span v-show="date">{{ formatDate(date) }}</span>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn text icon @click.stop="onSelectDate(null)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-flex>
            <v-flex xs12>
              <v-combobox
                v-model="weather"
                :items="items"
                :label="$t('Project health')"
              >
                <template slot="selection" slot-scope="data">
                  <img :src="getIcon(data.item)">
                </template>
                <template slot="item" slot-scope="data">
                  <img :src="getIcon(data.item)">
                </template>
              </v-combobox>
            </v-flex>

            <v-flex xs12>
              <label>{{ $t("Description") }}</label>
              <rich-editor
                ref="description"
                v-model="description"
                :max-height="!$vuetify.breakpoint.xsOnly ? '200px' : null"
              />
            </v-flex>
          </v-layout>
        </v-form>
      </template>

      <template v-slot:actions>
        <v-btn text :disabled="!valid || !coherent" @click="create">
          {{ $t("Update") }}
        </v-btn>
      </template>
    </generic-dialog>
  </div>
</template>

<script>
import { Meteor } from "meteor/meteor";
import DatesMixin from "/imports/ui/mixins/DatesMixin.js";
import moment from "moment";

export default {
  mixins: [DatesMixin],
  props: {
    report: {
      type: Object,
      default: () => {}
    }
  },
  i18n: {
    messages: {
      en: {
        "Edit report": "Edit report",
        Date: "Date",
        None: "None",
        "Weekly point": "Weekly point",
        "Project health": "Project health"
      },
      fr: {
        "Edit report": "Editer le bulletin",
        Date: "Date",
        None: "Aucune",
        "Weekly point": "Point hebdomadaire",
        "Project health": "Santé du projet"
      }
    }
  },
  data() {
    return {
      showDialog: false,
      showSelectDate: false,
      date: null,
      coherent: false,
      valid: false,
      name: "",
      weather: "",
      nameRules: [
        (v) => !!v || this.$t("Name is mandatory"),
        (v) => (v && v.length > 1) || this.$t("Name is too short")
      ],
      description: "",
      items: ["sunny", "cloudy", "storm"]
    };
  },
  methods: {
    open() {
      this.showDialog = true;
      this.$nextTick(() => {
        this.name = this.report.name;
        this.date = moment(this.report.date).format("YYYY-MM-DD");
        this.description = this.report.description;
        this.weather = this.report.weather;
        this.checkConsistency();
      });
    },
    close() {
      this.showDialog = false;
    },
    onSelectDate(date) {
      this.date = date;
      this.checkConsistency();
    },
    checkConsistency() {
      if (!this.report.date) {
        this.coherent = false;
        return;
      }
      this.coherent = true;
    },
    create() {
      this.showDialog = false;
      Meteor.call(
        "healthReports.update",
        {
          id: this.report._id,
          name: this.name,
          description: this.description,
          date: this.date,
          weather: this.weather
        },
        (error) => {
          this.$emit("updated");
          if (error) {
            this.$notifyError(error);
          }
        }
      );
      this.showDialog = false;
    },
    getIcon(weather) {
      return Meteor.absoluteUrl(`/weather/${weather}.svg`);
    }
  }
};
</script>

<style scoped>
.date {
  margin-bottom: 24px;
}
</style>
