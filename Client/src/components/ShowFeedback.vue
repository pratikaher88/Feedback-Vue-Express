<template>
  <section>
  </section>
</template>

<script>
import axios from 'axios';


export default {
    name: 'ShowFeedback',
    data() {
        return{
            feedbackresponses: null,
        }
    },

    mounted() {
        console.log("Hello")
        axios.get('/api/responses')
        .then((response) => {
            console.log(response.data);
            console.log(response.status);
            console.log(response.statusText);
            console.log(response.headers);
            console.log(response.config);
        });

    }

}
</script>

<style>

</style>