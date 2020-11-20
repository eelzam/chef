<template>
  <div>

             <div class="section section-contacts">
              <div class="container">
                <div class="md-layout">
                  <div v-if="!showPostContact" class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
                    <h2 class="text-center title">צור קשר</h2>
                    <h4 class="text-center description">
                    משרד עורכי הדין שלנו מתמחה במגוון תחומים, ולאורך השנים הצלחנו לעזור ללקוחות שלנו לנצח בתיקים החשובים להם ביותר.
                    </h4>
                    <br><br>
                    <form class="contact-form">
                      <div class="md-layout">
                        <div class="md-layout-item md-size-50">
                          <md-field :class="getValidationClass('name')">
                            <label>שם</label>
                            <md-input v-model="form.name" type="text"></md-input>
                            <span class="md-error" v-if="!$v.form.name.required">נא למלא שם בבקשה</span>
                            <span class="md-error" v-else-if="!$v.form.name.minlength">נא למלא שם מלא בבקשה</span>
                          </md-field>
                        </div>
                        <div class="md-layout-item md-size-50">
                          <md-field :class="getValidationClass('email')">
                            <label>כותבת דואר אלקטרוני</label>
                            <md-input v-model="form.email" type="email"></md-input>
                              <span class="md-error" v-if="!$v.form.email.required">חסר כתובת אימייל</span>
                              <span class="md-error" v-else-if="!$v.form.email.email">מייל לא תיקני</span>
                          </md-field>

                        </div>
                      </div>
                      <md-field maxlength="5">
                        <label>הודעה</label>
                        <md-textarea v-model="form.message"></md-textarea>
                      </md-field>
                      <br><br>
                      <div class="md-layout">
                        <div class="md-layout-item md-size-33 mx-auto text-center">
                          <md-button @click="post()" class="md-success">שלח הודעה</md-button>
                        </div>
                      </div>
                    </form>
                  </div>

                    <transition name="fade">
                      <div class="description text-center" v-if="showPostContact" >
                           תודה, נהיה בקשר.
                      </div>
                    </transition>


                </div>
              </div>
            </div>

  </div>
</template>

<script>

import { leadsCollection } from '@/firebase'
  import { validationMixin } from 'vuelidate'
  import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'

export default {
  name: 'LeadCapture',
  props: ['_post'],
  mixins: [validationMixin],
  data() {
    return {
      form: {
        message: null,
        email: null,
        name: null
      },
      showPostContact: false,

    }
  },
  validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        email: {
          required,
          email
        }
      }
    },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },

    async post() {
      this.$v.$touch();

        if (!this.$v.$invalid) {
          await leadsCollection.add({
                name: this.form.name,
                message: this.form.message,
                email: this.form.email,
                createdOn: new Date(),
              })

          this.showPostContact = true;
        }

      }
  }
};
</script>

<style lang="scss" scoped>
.section {
  padding: 0;
}

.md-layout-item label {
    text-align: right;
    right: 0px;
  }

</style>
