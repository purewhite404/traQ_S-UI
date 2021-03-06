import apis from '@/lib/apis'
import store from '@/store'
import {
  StampCreatedEvent,
  StampUpdatedEvent,
  StampDeletedEvent,
  StampPaletteCreatedEvent,
  StampPaletteUpdatedEvent,
  StampPaletteDeletedEvent
} from './events'

export const onStampCreated = async ({ id }: StampCreatedEvent['body']) => {
  const res = await apis.getStamp(id)
  store.commit.entities.addStamp({ id, entity: res.data })
}

export const onStampUpdated = async ({ id }: StampUpdatedEvent['body']) => {
  const res = await apis.getStamp(id)
  store.commit.entities.extendStamps({ [id]: res.data })
}

export const onStampDeleted = ({ id }: StampDeletedEvent['body']) => {
  store.commit.entities.deleteStamp(id)
}

export const onStampPaletteCreated = async (
  data: StampPaletteCreatedEvent['body']
) => {
  // eslint-disable-next-line no-console
  console.error('onStampPaletteCreated: Not implemented')
}

export const onStampPaletteUpdated = async (
  data: StampPaletteUpdatedEvent['body']
) => {
  // eslint-disable-next-line no-console
  console.error('onStampPaletteUpdated: Not implemented')
}

export const onStampPaletteDeleted = (
  data: StampPaletteDeletedEvent['body']
) => {
  // eslint-disable-next-line no-console
  console.error('onStampPaletteDeleted: Not implemented')
}
