import React, { Component } from 'react';
import {
  EuiSearchBar,
  EuiSpacer,
  Pager,
  EuiTableHeader,
  EuiTableBody,
  EuiTablePagination,
  EuiTableHeaderCell,
  EuiTableRowCell,
  EuiTableRow,
  EuiTable,
  EuiLink,
} from '@elastic/eui';
import { formatBytes } from '../../../common';

const tableId = 'table-id';
const initialQuery = EuiSearchBar.Query.MATCH_ALL;
const defaultItemPerPage = 10;

export class PodListTable extends Component {
  constructor(props) {
    super(props);
    this.items = props.pods === null ? [] : props.pods;

    this.state = {
      sortedColumn: 'namespace',
      itemsPerPage: defaultItemPerPage,
      query: initialQuery,
      filteredItems: this.items,
    };

    this.columns = [
      {
        field: 'namespace',
        name: 'Namespace',
        truncateText: true,
        mobileOptions: {
          show: false,
        },
        sortable: true,
      },
      {
        field: 'link',
        name: 'Pod name',
        truncateText: true,
        mobileOptions: {
          show: true,
        },
        sortable: true,
        render: (link) => (
          <span>
            <EuiLink
              color={link.isDeprecated ? 'danger' : 'primary'}
              data-test-subj="linkToDetailPage"
              href={link.link}
              target="_blank"
            >
              {link.linkText}
            </EuiLink>
          </span>
        ),
      },
      {
        field: 'current_usage',
        name: 'Current CPU usage',
        sortable: true,
        options: {
          nested: true,
          field: 'cpu',
        },
        render: (currentUsage) => {
          if (currentUsage === undefined) {
            return undefined;
          }
          return currentUsage.toFixed(2);
        },
      },
      {
        field: 'limit',
        name: 'CPU Limit',
        sortable: true,
        options: {
          nested: true,
          field: 'cpu',
        },
        render: (limit) => {
          if (limit === undefined) {
            return -1;
          }
          return limit.toFixed(2);
        },
      },
      {
        field: 'request',
        name: 'CPU request',
        sortable: true,
        options: {
          nested: true,
          field: 'cpu',
        },
        render: (request) => {
          if (request === undefined) {
            return -1;
          }
          return request.toFixed(2);
        },
      },
      {
        field: 'optimized_usage',
        name: 'Recommendation CPU',
        sortable: true,
        options: {
          nested: true,
          field: 'cpu',
        },
        render: (value) => {
          if (value === undefined) {
            return value;
          }
          return value.toFixed(2);
        },
      },
      {
        field: 'current_usage',
        name: 'Current memory usage',
        sortable: true,
        options: {
          nested: true,
          field: 'memory',
        },
        render: (currentUsage) => {
          if (currentUsage === undefined) {
            return undefined;
          }
          return formatBytes(currentUsage);
        },
      },
      {
        field: 'limit',
        name: 'Memory Limit',
        sortable: true,
        options: {
          nested: true,
          field: 'memory',
        },
        render: (limit) => {
          if (limit === undefined) {
            return undefined;
          }
          return formatBytes(limit);
        },
      },
      {
        field: 'request',
        name: 'Memory request',
        sortable: true,
        options: {
          nested: true,
          field: 'memory',
        },
        render: (request) => {
          if (request === undefined) {
            return undefined;
          }
          return formatBytes(request);
        },
      },
      {
        field: 'optimized_usage',
        name: 'Recommendation memory',
        sortable: true,
        options: {
          nested: true,
          field: 'memory',
        },
        render: (value) => {
          if (value === undefined) {
            return undefined;
          }
          return formatBytes(value);
        },
      },
    ];

    this.pager = new Pager(this.items.length, this.state.itemsPerPage);
    this.state.firstItemIndex = this.pager.getFirstItemIndex();
    this.state.lastItemIndex = this.pager.getLastItemIndex();
  }

  onChange = ({ query }) => {
    let filteredItems;
    if (query === initialQuery) {
      filteredItems = this.items;
    } else {
      filteredItems = this.items.filter((item) => {
        return item.name.toLowerCase().includes(query.text.toLowerCase());
      });
    }

    this.pager = null;
    this.pager = new Pager(filteredItems.length, this.state.itemsPerPage);
    this.setState({
      query,
      filteredItems,
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  onChangeItemsPerPage = (itemsPerPage) => {
    this.pager.setItemsPerPage(itemsPerPage);
    this.setState({
      itemsPerPage,
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  onChangePage = (pageIndex) => {
    this.pager.goToPageIndex(pageIndex);
    this.setState({
      firstItemIndex: this.pager.getFirstItemIndex(),
      lastItemIndex: this.pager.getLastItemIndex(),
    });
  };

  renderHeaderCells() {
    const headers = [];

    this.columns.forEach((column, columnIndex) => {
      headers.push(
        <EuiTableHeaderCell
          key={column.field}
          // align={this.columns[columnIndex].alignment}
          // width={column.width}
          mobileOptions={column.mobileOptions}
        >
          {column.name}
        </EuiTableHeaderCell>
      );
    });
    return headers.length ? headers : null;
  }

  renderRows() {
    const renderRow = (item) => {
      const cells = this.columns.map((column) => {
        let cell = item[column.field];
        if (column.hasOwnProperty('options') && column.options.nested === true) {
          if (
            item.usage.hasOwnProperty(column.options.field) &&
            item.usage[column.options.field].hasOwnProperty(column.field)
          ) {
            cell = item.usage[column.options.field][column.field];
          } else {
            cell = undefined;
          }
        }
        if (column.hasOwnProperty('render') && cell !== undefined) {
          cell = column.render(cell);
        }
        return (
          <EuiTableRowCell
            key={column.field}
            // align={column.alignment}
            truncateText={cell && cell.truncateText}
          >
            {cell}
          </EuiTableRowCell>
        );
      });
      return (
        <EuiTableRow key={item.id} isSelectable={false} hasActions={false}>
          {cells}
        </EuiTableRow>
      );
    };
    const rows = [];

    for (
      let itemIndex = Math.max(this.state.firstItemIndex, 0);
      itemIndex <= this.state.lastItemIndex;
      itemIndex++
    ) {
      const item = this.state.filteredItems[itemIndex];
      rows.push(renderRow(item));
    }
    return rows;
  }

  render() {
    return (
      <div>
        <EuiSearchBar
          defaultQuery={initialQuery}
          onChange={this.onChange}
          box={{
            placeholder: 'e.g. kube-master',
          }}
        />

        <EuiSpacer size="s" />

        <EuiTable id={tableId}>
          <EuiTableHeader>{this.renderHeaderCells()}</EuiTableHeader>
          <EuiTableBody>{this.renderRows()}</EuiTableBody>
        </EuiTable>
        <EuiTablePagination
          aria-controls={tableId}
          activePage={this.pager.getCurrentPageIndex()}
          itemsPerPage={this.state.itemsPerPage}
          itemsPerPageOptions={[5, 10, 20, 50]}
          pageCount={this.pager.getTotalPages()}
          onChangeItemsPerPage={this.onChangeItemsPerPage}
          onChangePage={this.onChangePage}
          // compressed
        />
      </div>
    );
  }
}
