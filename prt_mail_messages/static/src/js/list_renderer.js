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

odoo.define("prt_mail_messages.list_renderer", function (require) {
    "use strict";
    var field_utils = require("web.field_utils");
    var ListRenderer = require("web.ListRenderer");

    // Simplify renderer and skip adding title
    ListRenderer.include({
        _renderBodyCell: function (record, node, colIndex, options) {
            if (
                !(
                    record.model === "mail.message" ||
                    record.model === "cetmix.conversation"
                )
            ) {
                return this._super.apply(this, arguments);
            }
            var tdClassName = "o_data_cell oe_read_only";
            var $td = $("<td>", {class: tdClassName, tabindex: -1});

            // We register modifiers on the <td> element so that it gets the correct
            // modifiers classes (for styling)
            var modifiers = this._registerModifiers(
                node,
                record,
                $td,
                _.pick(options, "mode")
            );
            // If the invisible modifiers is true, the <td> element is left empty.
            // Indeed, if the modifiers was to change the whole cell would be
            // rerendered anyway.
            if (modifiers.invisible && !(options && options.renderInvisible)) {
                return $td;
            }

            this._handleAttributes($td, node);
            this._setDecorationClasses(
                $td,
                this.fieldDecorations[node.attrs.name],
                record
            );

            var name = node.attrs.name;
            var field = this.state.fields[name];
            var value = record.data[name];
            var formatter = field_utils.format[field.type];
            var formatOptions = {
                escape: true,
                data: record.data,
                isPassword: false,
                digits: false,
            };
            var formattedValue = formatter(value, field, formatOptions);
            return $td.html(formattedValue);
        },
    });
});
