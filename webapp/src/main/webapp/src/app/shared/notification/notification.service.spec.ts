import { NotificationsStore } from './notifications.store';
import { NotificationService } from './notification.service';
import { Notification } from './notification';

const NotificationDefaults = {
  type: 'info',
  args: {},
  dismissOnTimeout: 10000,
  dismissible: true
};

describe('NotificationService', () => {
  let store: NotificationsStore, service: NotificationService;

  const a: Notification = {
    ...NotificationDefaults,
    type: 'info',
    id: 'a'
  };

  const b: Notification = {
    ...NotificationDefaults,
    type: 'danger',
    id: 'b'
  };

  const a2: Notification = {
    ...NotificationDefaults,
    type: 'info',
    id: 'a',
    dismissible: false
  };

  beforeEach(() => {
    store = new NotificationsStore();
    service = new NotificationService(store);
  });

  it('should push notification to stack', () => {
    expect(store.state).toEqual([]);
    service.showNotification(a);
    expect(store.state).toEqual([a]);
    service.showNotification(b);
    expect(store.state).toEqual([a, b]);
  });

  it('should apply default properties', () => {
    service.showNotification({ id: a.id });
    expect(store.state).toEqual([a]);
  });

  it('should replace last element on stack if the ID matches', () => {
    service.showNotification(a);
    service.showNotification(a2);
    expect(store.state).toEqual([a2]);
  });
});
