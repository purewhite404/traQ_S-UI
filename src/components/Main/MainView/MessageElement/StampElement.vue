<template>
  <div
    :class="$style.body"
    :title="state.tooltip"
    :data-include-me="state.includeMe"
    :data-my-count-has-incremented="state.myCountHasIncremented"
    @click="onClick"
  >
    <stamp
      :stamp-id="stamp.id"
      :size="20"
      without-title
      :class="$style.icon"
      @animationend.native="unsetMyCountHasIncremented"
    />
    <spin-number :value="stamp.sum" :class="$style.count" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  watch,
  PropType,
  onMounted
} from '@vue/composition-api'
import store from '@/store'
import SpinNumber from '@/components/UI/SpinNumber.vue'
import Stamp from '@/components/UI/Stamp.vue'
import { MessageStampById } from './MessageStampList.vue'

export default defineComponent({
  name: 'StampElement',
  components: { Stamp, SpinNumber },
  props: {
    stamp: {
      type: Object as PropType<MessageStampById>,
      required: true
    }
  },
  setup(props, context) {
    const stampName = computed(
      () => store.state.entities.stamps[props.stamp.id]?.name ?? ''
    )

    const state = reactive({
      includeMe: computed(() => props.stamp.myCount > 0),
      tooltip: computed(() =>
        [
          `:${stampName.value}:`,
          ...props.stamp.users.map(
            u =>
              `${store.state.entities.users[u.id]?.displayName ?? ''}(${
                u.count
              })`
          )
        ].join(' ')
      ),
      isProgress: false,
      myCountHasIncremented: false
    })

    const onClick = () => {
      if (state.isProgress) return
      if (state.includeMe) {
        context.emit('remove-stamp', props.stamp.id)
      } else {
        context.emit('add-stamp', props.stamp.id)
      }
      state.isProgress = true
    }
    watch(
      () => props.stamp,
      () => {
        state.isProgress = false
      }
    )

    onMounted(() => {
      if (props.stamp.myCount > 0) {
        state.myCountHasIncremented = true
      }
    })
    watch(
      () => props.stamp.myCount,
      (newVal, oldVal) => {
        if (oldVal < newVal) {
          state.myCountHasIncremented = true
        }
      }
    )
    const unsetMyCountHasIncremented = () => {
      state.myCountHasIncremented = false
    }

    return {
      state,
      onClick,
      unsetMyCountHasIncremented
    }
  }
})
</script>

<style lang="scss" module>
.body {
  @include background-tertiary;
  &[data-include-me] {
    background: $theme-accent-primary--03;
  }
  display: inline-flex;
  flex-shrink: 0;
  height: 24px;
  align-items: center;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  contain: content;
}

.icon {
  .body[data-my-count-has-incremented] & {
    animation: stamp-pressed 0.5s ease;
  }
}

@keyframes stamp-pressed {
  0% {
    transform: scale(0.7);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.count {
  color: $theme-ui-primary--06;
  .body[data-include-me] &,
  .body:hover & {
    @include color-ui-primary;
  }
  @include size-body2;
  font-weight: bold;
  margin: {
    left: 6px;
    right: 4px;
  }
}
</style>
