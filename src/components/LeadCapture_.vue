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


                         <form @submit.prevent>
<!--
                          <md-field :class="getValidationClass('name')">
                            <label>שם</label>
                            <md-input v-model="form.name" type="text"></md-input>
                            <span class="md-error" v-if="!$v.form.name.required">נא למלא שם בבקשה</span>
                            <span class="md-error" v-else-if="!$v.form.name.minlength">נא למלא שם מלא בבקשה</span>
                          </md-field>
-->

                            <div class="form-group" :class="{ 'form-group--error': $v.form.name.$error }">
                              <label class="form__label">שם</label>
                              <input class="form__input" v-model.trim="$v.form.name.$model"/>
                            </div>
                           <div v-if="!$v.form.name.$error">
                            <div class="error" v-if="!$v.form.name.required">נא למלא שם בבקשה</div>
                            <div class="error" v-if="!$v.form.name.minLength">שם חייב להכיל לפחות {{$v.form.name.$params.minLength.min}} תווים.</div>
                          </div>

                        </form>

                        </div>

                        <!--

                        <div class="md-layout-item md-size-50">
                          <field :class="getValidationClass('email')">
                            <label>כותבת דואר אלקטרוני</label>
                            <input v-model="form.email" type="email"></input>
                              <span class="md-error" v-if="!$v.form.email.required">חסר כתובת אימייל</span>
                              <span class="md-error" v-else-if="!$v.form.email.email">מייל לא תיקני</span>
                          </field>

                        </div>

                        -->

                      </div>

                      <div class="md-layout">
                        <div class="md-layout-item md-size-33 mx-auto text-center">
                          <button @click="post()" class="md-success">שלח הודעה</button>
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



<!--

          <div class="create-post">

            <p>create a post</p>
            <form @submit.prevent>
              &lt;!&ndash;<textarea v-model.trim="post.content"></textarea>&ndash;&gt;
              <input v-model.trim="post.title" placeholder="title"/>
              <input v-model.trim="post.name" placeholder="url"/>
              <input v-model.trim="post.urlCategory" placeholder="url category"/>
              <vue-editor v-model.trim="post.content"></vue-editor>
              <Upload v-if="fullEditPost" :post="fullEditPost" dir="ltr"></Upload>
              <button @click="createPost()" :disabled="post.content === ''" class="button">post</button>
            </form>
          </div>
-->



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
        name: null,
        submitStatus: null
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

          this.submitStatus = 'PENDING'
          await leadsCollection.add({
                name: this.form.name,
                message: this.form.message,
                email: this.form.email,
                createdOn: new Date(),
              })

          this.submitStatus = 'OK'
          this.showPostContact = true;
        }
        else {
          this.submitStatus = 'ERROR'
        }

      }
  }
};
</script>

<style lang="scss" scoped>

input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
}

.dirty {
  border-color: #5A5;
  background: #EFE;
}

.dirty:focus {
  outline-color: #8E8;
}

.error {
  border-color: red;
  background: #FDD;
}

.error:focus {
  outline-color: #F99;
}


</style>
