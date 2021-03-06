import React, { useState } from 'react'
import PropTypes from 'prop-types'

import {
  useQuery,
  isQueryLoading,
  hasQueryBeenLoaded,
  useClient
} from 'cozy-client'

import DumbContactCardModal from './DumbContactCardModal'
import { deleteContact } from '../../connections/allContacts'

import { buildContactQuery, queryAllGroups } from '../../helpers/queries'

const ContactCardModal = props => {
  const { onClose, id } = props
  const client = useClient()

  const [editMode, setEditMode] = useState(false)
  const [
    shouldDisplayConfirmDeleteModal,
    setShouldDisplayConfirmDeleteModal
  ] = useState(false)

  const toggleConfirmDeleteModal = () => {
    setShouldDisplayConfirmDeleteModal(!shouldDisplayConfirmDeleteModal)
  }

  const handleDeleteContact = async (contactParam = null) => {
    const { contact, onDeleteContact, onClose } = props
    onClose && onClose()
    await deleteContact(client, contactParam ? contactParam : contact)
    onDeleteContact && onDeleteContact(contactParam ? contactParam : contact)
  }

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const queryContactById = buildContactQuery(id)
  const resultContactById = useQuery(
    queryContactById.definition,
    queryContactById.options
  )
  const resultAllGroups = useQuery(
    queryAllGroups.definition,
    queryAllGroups.options
  )

  const dataHaveBeenLoaded =
    (!isQueryLoading(resultContactById) ||
      hasQueryBeenLoaded(resultContactById)) &&
    (!isQueryLoading(resultAllGroups) || hasQueryBeenLoaded(resultAllGroups))

  return (
    <DumbContactCardModal
      dataHaveBeenLoaded={dataHaveBeenLoaded}
      onClose={onClose}
      editMode={editMode}
      contact={resultContactById.data}
      allGroups={resultAllGroups.data}
      toggleConfirmDeleteModal={toggleConfirmDeleteModal}
      toggleEditMode={toggleEditMode}
      shouldDisplayConfirmDeleteModal={shouldDisplayConfirmDeleteModal}
      onDeleteContact={handleDeleteContact}
    />
  )
}

ContactCardModal.propTypes = {
  onClose: PropTypes.func,
  id: PropTypes.string.isRequired,
  onDeleteContact: PropTypes.func,
  isloading: PropTypes.bool
}

export default ContactCardModal
