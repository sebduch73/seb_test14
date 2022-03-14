/**********************************************************************************
* 
*    Copyright (C) Cetmix OÜ
*
*    This program is free software: you can redistribute it and/or modify
*    it under the terms of the GNU LESSER GENERAL PUBLIC LICENSE as
*    published by the Free Software Foundation, either version 3 of the
*    License, or (at your option) any later version.
*
*    This program is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU LESSER GENERAL PUBLIC LICENSE for more details.
*
*    You should have received a copy of the GNU LESSER GENERAL PUBLIC LICENSE
*    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
**********************************************************************************/

odoo.define("prt_mail_messages.list_model", function (require) {
    "use strict";

    var ListModel = require("web.ListModel");

    ListModel.include({
        _searchReadUngroupedList: function (list) {
            if (list.model !== "mail.message" || list.res_ids.length === 0) {
                return this._super.apply(this, arguments);
            }
            var self = this;
            var fieldNames = list.getFieldNames();
            var prom;
            if (list.__data) {
                // the data have already been fetched (alonside the groups by the
                // call to 'web_read_group'), so we can bypass the search_read
                prom = Promise.resolve(list.__data);
            } else {
                // Cetmix Changes Start: add values to context. Will use them in backend to render paging properly
                prom = this._rpc({
                    route: "/web/dataset/search_read",
                    model: list.model,
                    fields: fieldNames,
                    context: _.extend({}, list.getContext(), {
                        bin_size: true,
                        first_id: list.res_ids[0],
                        last_id: list.res_ids[list.res_ids.length - 1],
                        last_offset: list.last_offset ? list.last_offset : 0,
                        list_count: list.count,
                    }),
                    domain: list.domain || [],
                    limit: list.limit,
                    offset: list.loadMoreOffset + list.offset,
                    orderBy: list.orderedBy,
                });
                // Cetmix changed end.
            }
            return prom.then(function (result) {
                // Cetmix changes start: Store previous vals
                list.last_offset = list.offset;
                // Cetmin changes end.

                delete list.__data;
                list.count = result.length;
                var ids = _.pluck(result.records, "id");
                var data = _.map(result.records, function (record) {
                    var dataPoint = self._makeDataPoint({
                        context: list.context,
                        data: record,
                        fields: list.fields,
                        fieldsInfo: list.fieldsInfo,
                        modelName: list.model,
                        parentID: list.id,
                        viewType: list.viewType,
                    });

                    // add many2one records
                    self._parseServerData(fieldNames, dataPoint, dataPoint.data);
                    return dataPoint.id;
                });
                if (list.loadMoreOffset) {
                    list.data = list.data.concat(data);
                    list.res_ids = list.res_ids.concat(ids);
                } else {
                    list.data = data;
                    list.res_ids = ids;
                }
                self._updateParentResIDs(list);
                return list;
            });
        },
    });

    return ListModel;
});
