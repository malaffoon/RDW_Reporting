import {
  oneDatabasePerDataSource,
  onePasswordPerUser,
  uniqueDatabasePerInstance
} from './tenant-form.validators';
import { FormControl, FormGroup } from '@angular/forms';

describe('onePasswordPerUser', () => {
  it('should return null when form is valid', () => {
    expect(
      onePasswordPerUser(
        new FormGroup({
          'datasources.reporting_ro.username': new FormControl('user1'),
          'datasources.reporting_ro.password': new FormControl('a'),
          'datasources.warehouse_ro.username': new FormControl('user1'),
          'datasources.warehouse_ro.password': new FormControl('a'),
          'datasources.olap_ro.username': new FormControl('user2'),
          'datasources.olap_ro.password': new FormControl('c')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      onePasswordPerUser(
        new FormGroup({
          'datasources.reporting_ro.username': new FormControl('user1'),
          'datasources.reporting_ro.password': new FormControl('a'),
          'datasources.warehouse_ro.username': new FormControl('user1'),
          'datasources.warehouse_ro.password': new FormControl('b'),
          'datasources.olap_ro.username': new FormControl('user2'),
          'datasources.olap_ro.password': new FormControl('c')
        })
      )
    ).toEqual({
      onePasswordPerUser: {
        usernames: ['user1']
      }
    });
  });
});

describe('oneDatabasePerDataSource', () => {
  it('should return null when form is valid', () => {
    expect(
      oneDatabasePerDataSource(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('a'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      oneDatabasePerDataSource(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('x'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('y')
        })
      )
    ).toEqual({
      oneDatabasePerDataSource: {
        conflicts: [['reporting', ['a', 'x']], ['olap2', ['d', 'y']]]
      }
    });
  });
});

describe('uniqueDatabasePerInstance', () => {
  it('should return null when form is valid', () => {
    expect(
      uniqueDatabasePerInstance(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('a'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('c'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toBeNull();
  });

  it('should return errors when form is invalid', () => {
    expect(
      uniqueDatabasePerInstance(
        new FormGroup({
          'datasources.reporting_ro.urlParts.database': new FormControl('a'),
          'datasources.reporting_rw.urlParts.database': new FormControl('b'),
          'datasources.warehouse_ro.urlParts.database': new FormControl('b'),
          'datasources.warehouse_rw.urlParts.database': new FormControl('b'),
          'datasources.olap_ro.schemaSearchPath': new FormControl('c'),
          'datasources.olap_rw.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_ro.schemaSearchPath': new FormControl('d'),
          'datasources.olap2_rw.schemaSearchPath': new FormControl('d')
        })
      )
    ).toEqual({
      uniqueDatabasePerInstance: {
        duplicates: [
          ['b', ['reporting', 'warehouse']],
          ['d', ['olap', 'olap2']]
        ]
      }
    });
  });
});
