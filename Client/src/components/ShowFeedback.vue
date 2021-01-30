<template>
  <section>

        <!-- <b-list-group v-for="(value, index) in feedbackresponses" :key="index">
    
            <b-list-group-item align="left" > <strong> {{ value }}</strong> </b-list-group-item>

        </b-list-group> -->
        
        <div>
            <b-table striped hover :items="feedbackresponses" :fields="fields"></b-table>
        </div>

  </section>
</template>

<script>
import axios from 'axios';


export default {
    name: 'ShowFeedback',
    data() {
        return{
            fields: ['SiteName', 'Resolution', 'userAgent', 'ACCEPT LANGUAGE', 'REFERRER','Plugins', 'ImageLocation', 'Comment'],
            feedbackresponses: [],
        }
    },

    mounted() {
        axios.get('/api/responses')
        .then((response) => {
            
            // this.feexdbackresponses.push(response.data)
            
            for(var res in response.data){
                var result = {}
                for(var value in response.data[res]){
                    var data = response.data[res][value]
                    var key = Object.keys(data)[0]
                    result[key] = data[key]
                }
                this.feedbackresponses.push(result)
            }

            // console.log(response.status);
            // console.log(response.statusText);
            // console.log(response.headers);
            // console.log(response.config);
        });

    }

}
</script>

<style>

</style>