import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, onUnmounted, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const standings = ref(null);

    const loadStandings = async (selectedMatch, seasonId) => {
         
        try {
            await axios
                .get(`https://api-football-v3.herokuapp.com/api/v3/standings?league=${selectedMatch.league.id}&season=${seasonId}`)
                .then(response => {
                    const {away, home} = selectedMatch.teams;
                     standings.value = response.data.response[0].league.standings;
                    if( standings.value.length <= 1) {
                          standings.value = response.data.response[0].league.standings.shift();
                         store.setStandings(standings.value);
                    }else{
                        const getGroup =  standings.value?.filter(group =>group.find((item) => item.team.id == away.id || item.team.id == home.id));
                        store.setStandings(getGroup);
                    }
                    
                    const getTeams =  standings.value.flat()?.filter(item => item.team.id == away.id || item.team.id == home.id);
                    store.setTeamsFromStandings(getTeams)
               
                  
                })
              
        } catch (error) {}
    };

    return {
        standings,
        loadStandings
    };
}
