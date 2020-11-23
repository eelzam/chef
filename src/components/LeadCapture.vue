<template>
  <div>
                    <br><br>
      <div class="section section-contacts">
              <div class="container">
                <div class="md-layout">
                  <div v-if="!showPostContact" class="md-layout-item md-size-66 md-xsmall-size-100 mx-auto">
                    <h2 class="text-center title">מעוניין במחיר ובפרטים?</h2>
                    <h4 class="text-center description">
                        אנו נחזור אלייך בהקדם!
                    </h4>

                      <div class="md-layout">
                        <div class="md-layout-item md-size-50">

                            <form @submit.prevent="submit">

                              <div class="form-container">

                              <div class="field">
                                  <div class="form-group" :class="{ 'form-group--error': $v.name.$error }">
                                    <label class="form__label">שם</label>
                                    <input class="form__input" v-model.trim.lazy="$v.name.$model"/>
                                  </div>
                                  <div v-if="$v.name.$error">
                                    <div class="error" v-if="!$v.name.required">נא למלא שם בבקשה</div>
                                    <div class="error" v-if="!$v.name.minLength">שם חייב להכיל לפחות {{$v.name.$params.minLength.min}} תווים.</div>
                                  </div>
                              </div>

                              <div class="field">
                                 <div class="form-group" :class="{ 'form-group--error': $v.phone.$error }">
                                    <label class="form__label">נייד</label>
                                    <input class="form__input" v-model.trim.lazy="$v.phone.$model"/>
                                  </div>
                                  <div v-if="$v.phone.$error">
                                    <div class="error" v-if="!$v.phone.required">נא למלא מספר נייד </div>
                                    <div class="error" v-if="!$v.phone.minLength">נייד חייב להכיל לפחות {{$v.name.$params.minLength.min}} תווים.</div>
                                  </div>
                              </div>

                                  <button class="button" type="submit" :disabled="submitStatus === 'PENDING'">שלח</button>
                                  <p class="typo__p" v-if="submitStatus === 'OK'"> תודה, נהיה בקשר.</p>
                                  <p class="typo__p" v-if="submitStatus === 'ERROR'">בבקשה למלא את הפרטים :)</p>
                                  <p class="typo__p" v-if="submitStatus === 'PENDING'">שולח...</p>

                                </div>
                            </form>



                        </div>

                      </div>

<!--
                    <transition name="fade">
                      <div class="description text-center" v-if="showPostContact" >
                           תודה, נהיה בקשר.
                      </div>
                    </transition>-->


                </div>
              </div>
            </div>

         </div>

  </div>
</template>




<script>

import { required, minLength } from 'vuelidate/lib/validators'
import {leadsCollection} from "@/firebase";

export default {
  data() {
    return {
      name: '',
      phone: '',
      age: 0,
      submitStatus: null,
      showPostContact: false,
    }
  },
  validations: {
    name: {
      required,
      minLength: minLength(4)
    },
    phone: {
      required,
      minLength: minLength(10)
    }
  },
  methods: {
    async submit() {
      console.log('submit!')
      this.$v.$touch()
      if (this.$v.$invalid) {

        this.submitStatus = 'ERROR'
      } else {
        // do your submit logic here
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
    }


  }
}
</script>

<style lang="scss" scoped>

.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row
}

.field {
  margin: 15px;
  width: 25vw;
}


@media (max-width: 767px) {

.form-container {
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

  .field {
  margin: 5px;
  width: 70vw;
}

}

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
