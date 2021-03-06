<template>
  <div class="organization-settings-general">
    <v-subheader>Titre</v-subheader>
    <v-card>
      <div class="description">
        <div
          v-show="
            !editName && organization.name && organization.name.length > 0
          "
          @click="startEditName"
        >
          {{ organization.name }}
        </div>
        <div v-show="!organization.name && !editName" @click="startEditName">
          Aucun nom
        </div>
        <div v-show="editName">
          <v-text-field
            ref="name"
            v-model="organization.name"
            :label="$t('Name')"
            @keyup.enter="updateName"
          />
          <v-btn icon @click="updateName">
            <v-icon color="green">
              mdi-check-circle
            </v-icon>
          </v-btn>
          <v-btn icon @click="cancelUpdateName">
            <v-icon color="red">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
    <v-subheader>Description</v-subheader>
    <v-card>
      <div class="description">
        <div
          v-show="
            !editDescription &&
              organization.description &&
              organization.description.length > 0
          "
          @click="startEditDescription"
        >
          <div
            class="tiptap-editor-view"
            v-html="markDown(organization.description)"
          />
        </div>
        <div
          v-show="!organization.description && !editDescription"
          @click="startEditDescription"
        >
          {{ $t("No description") }}
        </div>
        <div v-show="editDescription">
          <v-textarea
            ref="description"
            v-model="organization.description"
            solo
            label="Description"
            @keydown.shift.enter="updateDescription"
          />
          <v-btn icon @click="updateDescription">
            <v-icon color="green">
              mdi-check-circle
            </v-icon>
          </v-btn>
          <v-btn icon @click="cancelUpdateDescription">
            <v-icon color="red">
              mdi-close-circle
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import MarkdownMixin from "/imports/ui/mixins/MarkdownMixin.js";

export default {
  name: "OrganizationSettingsGeneral",
  mixins: [MarkdownMixin],
  props: {
    organization: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      editDescription: false,
      savedDescription: "",
      editName: false,
      savedName: ""
    };
  },
  methods: {
    startEditDescription() {
      this.savedDescription = this.organization.description;
      this.editDescription = true;
      this.$nextTick(() => this.$refs.description.focus());
    },

    updateDescription() {
      this.editDescription = false;
      Meteor.call("organizations.updateDescription", {
        organizationId: this.organization._id,
        description: this.organization.description
      });
    },

    cancelUpdateDescription() {
      this.editDescription = false;
      this.organization.description = this.savedDescription;
    },

    startEditName() {
      this.savedName = this.organization.name;
      this.editName = true;
      this.$nextTick(() => this.$refs.name.focus());
    },

    updateName() {
      this.editName = false;
      Meteor.call("organizations.updateName", {
        organizationId: this.organization._id,
        name: this.organization.name
      });
    },

    cancelUpdateName() {
      this.editName = false;
      this.organization.name = this.savedName;
    }
  }
};
</script>

<style scoped>
.description {
  margin-left: 24px;
  margin-right: 24px;
  margin-bottom: 12px;
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
