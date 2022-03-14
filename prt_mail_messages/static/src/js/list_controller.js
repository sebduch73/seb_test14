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

odoo.define("prt_mail_messages.list_controller", function (require) {
    "use strict";

    var ListController = require("web.ListController");

    ListController.include({
        _getPagingInfo: function (state) {
            if (!state.count) {
                return null;
            }
            var pager = this._super(...arguments);
            if (state.model === "mail.message" || this.modelName === "mail.message") {
                pager.editable = false;
            }
            return pager;
        },
    });

    return ListController;
});
