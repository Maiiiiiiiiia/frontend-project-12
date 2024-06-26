import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dropdown, ButtonGroup } from 'react-bootstrap';
import { Plus } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import Col from 'react-bootstrap/Col';
import { useGetChannelsQuery, channelsApi } from '../../slices/channelsSlice';
import { changeChannel } from '../../slices/appSlice';
import { showModal } from '../../slices/modalSlice';
import RenderModal from '../modal/RenderModal';
import { messagesApi } from '../../slices/messagesSlice';
import useSocket from '../../hooks/useSocket';

const Channels = () => {
  const { t } = useTranslation();
  const { data: channels = [] } = useGetChannelsQuery();
  const dispatch = useDispatch();
  const currentChannelId = useSelector((state) => state.app.currentChannelId);
  const socket = useSocket();

  const switchChannel = ({ id, name }) => {
    if (id !== currentChannelId) {
      dispatch(changeChannel({ id, name }));
    }
  };

  const setShowModal = (type, item = null) => {
    dispatch(showModal({ type, id: item?.id, name: item?.name }));
  };

  useEffect(() => {
    socket.on('renameChannel', (payload) => {
      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
        const channel = draft.find((ch) => ch.id === payload.id);
        if (channel) {
          channel.name = payload.name;
        }
      }));
    });

    socket.on('newChannel', (payload) => {
      dispatch(channelsApi.util.updateQueryData('getChannels', undefined, (draft) => {
        draft.push(payload);
      }));
    });

    socket.on('removeChannel', async (payload) => {
      dispatch(channelsApi.util.updateQueryData(
        'getChannels',
        undefined,
        (draft) => draft.filter((ch) => ch.id !== payload.id),
      ));
      dispatch(messagesApi.util.updateQueryData(
        'getMessages',
        undefined,
        (draft) => draft.filter((message) => message.channelId !== payload.id),
      ));
    });

    return () => {
      socket.off('renameChannel');
      socket.off('newChannel');
      socket.off('removeChannel');
    };
  }, [dispatch, socket]);

  return (
    <>
      <Col xs="4" md="2" className="border-end px-0 bg-light flex-column d-flex">
        <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
          <b>{t('channels.title')}</b>
          <Button size="sm" variant="outline-primary" onClick={() => setShowModal('adding')}>
            <Plus />
            <span className="visually-hidden">{t('channels.button.plus')}</span>
          </Button>
        </div>
        <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
          {channels.map((channel) => (
            <li className="nav-item w-100" key={channel.id}>
              <Dropdown as={ButtonGroup} drop="down" className="w-100">
                <button
                  type="button"
                  className={`w-100 rounded-0 text-start text-truncate btn ${
                    channel.id === currentChannelId ? 'btn-secondary' : ''
                  }`}
                  onClick={() => switchChannel(channel)}
                >
                  <span className="me-1">
                    #
                    {' '}
                    {channel.name}
                  </span>
                </button>
                {channel.removable && (
                  <>
                    <Dropdown.Toggle
                      as={Button}
                      className={`text-end ${channel.id === currentChannelId ? 'secondary' : 'light'}`}
                      id={`dropdown-split-button${channel.id}`}
                      variant={channel.id === currentChannelId ? 'secondary' : 'light'}
                    >
                      <span className="visually-hidden">{t('modals.channelManagement')}</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item id={channel.id} onClick={() => setShowModal('removing', { id: channel.id })}>{t('channels.button.delete')}</Dropdown.Item>
                      <Dropdown.Item id={channel.id} name={channel.name} onClick={() => setShowModal('renaming', { id: channel.id, name: channel.name })}>{t('channels.button.rename')}</Dropdown.Item>
                    </Dropdown.Menu>
                  </>
                )}
              </Dropdown>
            </li>
          ))}
        </ul>
      </Col>
      <RenderModal />
    </>
  );
};

export default Channels;
