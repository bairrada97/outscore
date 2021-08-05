import { defineComponent, reactive, toRefs, ref, onMounted, useFetch, onActivated, computed } from "@nuxtjs/composition-api";
import store from "@/store.js";
import axios from "axios";

export default function () {
    const awayTeamH2H = ref([]);
    const homeTeamH2H = ref([]);
    const h2h = ref([]);

    const loadH2H = async teams => {
        try {
            const { away, home } = teams;
            const h2hEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures/headtohead?h2h=${home.id}-${away.id}`;
            const awayTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${away.id}&last=41`;
            const homeTeamEndpoint = `https://api-football-v3.herokuapp.com/api/v3/fixtures?team=${home.id}&last=41`;
            const fetchURL = url => axios.get(url);

            const promiseArray = [awayTeamEndpoint, homeTeamEndpoint, h2hEndpoint].map(fetchURL);

            Promise.all(promiseArray)
                .then(responses => {
                    const hasAwayTeamH2HUpdated = !awayTeamH2H.value.cacheDate || responses[0].data.cacheDate != awayTeamH2H.value.cacheDate;
                    const hasHomeTeamH2HUpdated = !homeTeamH2H.value.cacheDate || responses[1].data.cacheDate != homeTeamH2H.value.cacheDate;
                    const hasH2HUpdated = !h2h.value.cacheDate || responses[2].data.cacheDate != h2h.value.cacheDate;

                    if (hasAwayTeamH2HUpdated) store.setAwayTeamH2H(responses[0].data.response);
                    if (hasHomeTeamH2HUpdated) store.setHomeTeamH2H(responses[1].data.response);
                    if (hasH2HUpdated) store.setH2H(responses[2].data.response.reverse().filter(item => item.fixture.status.short == "FT" || item.fixture.status.short == "AET" || item.fixture.status.short == "PEN"));
                })
                .then(() => {
                    awayTeamH2H.value = store.getAwayTeamH2H();
                    homeTeamH2H.value = store.getHomeTeamH2H();
                    h2h.value = store.getH2H();
                })

                .catch(err => {});
        } catch (error) {}
    };

    return {
        loadH2H,
        awayTeamH2H,
        homeTeamH2H,
        h2h
    };
}
