import Vue from 'vue'
import Router from 'vue-router'



/** @description Single Pages
 *  Generally independent (of all other pages) ones.
 */
import FirstStartPage from '@/modules/SinglePages/FirstStartPage'
import SelectPerson   from '@/modules/SinglePages/SelectPerson'
import PersonAdd      from '@/modules/SinglePages/PersonAdd'



/** @description Preference
 *  Pages that are proposed as a preference page.
 */
import Preference     from '@/modules/Preferences/Preference'
import PersonsList    from '@/modules/Preferences/PersonsList'
import DebugRunTask   from '@/modules/Preferences/DebugRunTask'




/** @description Extra
 *  Something cool yet not !closely! relate to the scope of MVP
 */
import Phenotype from '@/modules/Phenotype/Phenotype'
import DatabaseEditor from '@/modules/TableUI/Data/DataEditor'






import ProvidersList from '@/modules/ProfilePages/ProvidersList'



// import GBrowser from '@/modules/GeneticBrowser/GBrowser.vue'

import Quest from '@/modules/Quest/Quest'




import QuestResultsView  from '@/modules/ProfilePages/Content/Personal'
import GeneticDataView   from '@/modules/ProfilePages/Content/GeneticView'
import DataProperties    from '@/modules/TableUI/Data/DataProperties'
import GeneticDataList   from '@/modules/TableUI/Data/DataList'






import PersonView from '@/modules/ProfilePages/Profile'
import ServiceView from '@/modules/ProviderView'








import ModernUI from './modules/ModernUI'





Vue.use(Router)

let router =  new Router({ routes: [
    {
      path: '/person/:personId',
      component:   ModernUI,
      children: [
        {
          path: 'profile',
          component: PersonView,
          props: true
        },
        {
          path: 'preference',
          component: Preference,
          props: true
        },
        {
          path: 'data',
          component: GeneticDataList,
          props: true
        },
        {
          path: '/person/:personId/phenotype',
          component: Phenotype,
          props: true
        },
        {
          path: '/person/:personId/quest/:questionnaireId',
          component: Quest,
          props: true
        },
        {
          path: '/person/:personId/provider/:providerId',
          component: ServiceView,
          props: true
        },
        {
          path: '/person/:personId/providers',
          component: ProvidersList,
          props: true
        },
        {
          path: ''
        }
      ],
      props: true
    },
    {
      path: '/register',
      component:   PersonAdd
    },
    {
      path: '/data',
      component:   GeneticDataList
    },
  //  {
  //
  //  },
    {
      path: '/greeter',
      component: SelectPerson
    },
    {
      path: '/home',
      component: FirstStartPage
    },
    {
      path: '/personal/:id',
      props: true,
      component: QuestResultsView
    }
  ]
})

router.push('/home')

import store from './modules/Store'

router.beforeEach(
  (to, from, next) => {
    console.log()

    if (to.fullPath === '/home') return next()
    if (to.fullPath === '/greeter') return next()

    if (!store.state.currentPerson) {
      next('/greeter')
    }

    next()
  }
)

router.beforeResolve(
  (to, from, next) => {
    console.log()

    if (to.fullPath === '/home') return next()
    if (to.fullPath === '/greeter') return next()

    if (!store.state.currentPerson) {
      next('/greeter')
    }

    next()
  }
)

export default router
