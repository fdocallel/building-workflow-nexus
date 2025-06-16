
-- Insertar 30 registros de ejemplo en la tabla edificio
INSERT INTO public.edificio (
  "Code", 
  nombre, 
  proyecto, 
  num_edificios, 
  tipologia, 
  equipamiento, 
  analisis_estructural, 
  responsable
) VALUES 
-- Registros 1-10
('ED-001', 'Edificio 1', 'Proyecto A', 2, 'Administrativo', '[{"tipo": "Bomba", "cantidad": 2}, {"tipo": "Ventilador", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 180.5, "cargas_asumidas": "Cargas administrativas estándar"}'::jsonb, 'Ana'),
('ED-002', 'Edificio 2', 'Proyecto B', 1, 'Industrial', '[{"tipo": "Filtro", "cantidad": 1}, {"tipo": "Bomba", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 250.0, "cargas_asumidas": "Cargas industriales pesadas"}'::jsonb, 'Luis'),
('ED-003', 'Edificio 3', 'Proyecto C', 3, 'Residencial', '[{"tipo": "Ventilador", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 160.2, "cargas_asumidas": "Cargas residenciales ligeras"}'::jsonb, 'María'),
('ED-004', 'Edificio 4', 'Proyecto A', 4, 'Servicio', '[{"tipo": "Bomba", "cantidad": 1}, {"tipo": "Filtro", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 200.8, "cargas_asumidas": "Cargas de servicios generales"}'::jsonb, 'Jorge'),
('ED-005', 'Edificio 5', 'Proyecto B', 2, 'Administrativo', '[{"tipo": "Ventilador", "cantidad": 1}, {"tipo": "Bomba", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 175.3, "cargas_asumidas": "Cargas de oficinas"}'::jsonb, 'Ana'),
('ED-006', 'Edificio 6', 'Proyecto C', 1, 'Industrial', '[{"tipo": "Filtro", "cantidad": 2}, {"tipo": "Ventilador", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 290.5, "cargas_asumidas": "Cargas de maquinaria industrial"}'::jsonb, 'Luis'),
('ED-007', 'Edificio 7', 'Proyecto A', 5, 'Residencial', '[{"tipo": "Bomba", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 155.7, "cargas_asumidas": "Cargas habitacionales"}'::jsonb, 'María'),
('ED-008', 'Edificio 8', 'Proyecto B', 3, 'Servicio', '[{"tipo": "Ventilador", "cantidad": 2}, {"tipo": "Filtro", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 220.4, "cargas_asumidas": "Cargas de servicios públicos"}'::jsonb, 'Jorge'),
('ED-009', 'Edificio 9', 'Proyecto C', 2, 'Administrativo', '[{"tipo": "Bomba", "cantidad": 1}, {"tipo": "Ventilador", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 185.9, "cargas_asumidas": "Cargas corporativas"}'::jsonb, 'Ana'),
('ED-010', 'Edificio 10', 'Proyecto A', 1, 'Industrial', '[{"tipo": "Filtro", "cantidad": 3}, {"tipo": "Bomba", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 275.2, "cargas_asumidas": "Cargas de producción"}'::jsonb, 'Luis'),

-- Registros 11-20
('ED-011', 'Edificio 11', 'Proyecto B', 4, 'Residencial', '[{"tipo": "Ventilador", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 165.1, "cargas_asumidas": "Cargas domésticas"}'::jsonb, 'María'),
('ED-012', 'Edificio 12', 'Proyecto C', 2, 'Servicio', '[{"tipo": "Bomba", "cantidad": 2}, {"tipo": "Filtro", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 195.6, "cargas_asumidas": "Cargas de mantenimiento"}'::jsonb, 'Jorge'),
('ED-013', 'Edificio 13', 'Proyecto A', 3, 'Administrativo', '[{"tipo": "Ventilador", "cantidad": 3}, {"tipo": "Bomba", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 170.8, "cargas_asumidas": "Cargas de gestión"}'::jsonb, 'Ana'),
('ED-014', 'Edificio 14', 'Proyecto B', 1, 'Industrial', '[{"tipo": "Filtro", "cantidad": 1}, {"tipo": "Ventilador", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 285.0, "cargas_asumidas": "Cargas de manufactura"}'::jsonb, 'Luis'),
('ED-015', 'Edificio 15', 'Proyecto C', 5, 'Residencial', '[{"tipo": "Bomba", "cantidad": 3}, {"tipo": "Filtro", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 158.4, "cargas_asumidas": "Cargas habitacionales múltiples"}'::jsonb, 'María'),
('ED-016', 'Edificio 16', 'Proyecto A', 2, 'Servicio', '[{"tipo": "Ventilador", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 210.3, "cargas_asumidas": "Cargas de servicios técnicos"}'::jsonb, 'Jorge'),
('ED-017', 'Edificio 17', 'Proyecto B', 4, 'Administrativo', '[{"tipo": "Bomba", "cantidad": 1}, {"tipo": "Filtro", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 182.7, "cargas_asumidas": "Cargas administrativas complejas"}'::jsonb, 'Ana'),
('ED-018', 'Edificio 18', 'Proyecto C', 1, 'Industrial', '[{"tipo": "Ventilador", "cantidad": 1}, {"tipo": "Bomba", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 295.8, "cargas_asumidas": "Cargas industriales especiales"}'::jsonb, 'Luis'),
('ED-019', 'Edificio 19', 'Proyecto A', 3, 'Residencial', '[{"tipo": "Filtro", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 152.9, "cargas_asumidas": "Cargas residenciales estándar"}'::jsonb, 'María'),
('ED-020', 'Edificio 20', 'Proyecto B', 2, 'Servicio', '[{"tipo": "Bomba", "cantidad": 2}, {"tipo": "Ventilador", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 205.5, "cargas_asumidas": "Cargas de servicios especializados"}'::jsonb, 'Jorge'),

-- Registros 21-30
('ED-021', 'Edificio 21', 'Proyecto C', 5, 'Administrativo', '[{"tipo": "Filtro", "cantidad": 1}, {"tipo": "Ventilador", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 188.2, "cargas_asumidas": "Cargas de oficinas centrales"}'::jsonb, 'Ana'),
('ED-022', 'Edificio 22', 'Proyecto A', 1, 'Industrial', '[{"tipo": "Bomba", "cantidad": 1}, {"tipo": "Filtro", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 268.4, "cargas_asumidas": "Cargas de procesamiento"}'::jsonb, 'Luis'),
('ED-023', 'Edificio 23', 'Proyecto B', 4, 'Residencial', '[{"tipo": "Ventilador", "cantidad": 2}, {"tipo": "Bomba", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 162.6, "cargas_asumidas": "Cargas de vivienda colectiva"}'::jsonb, 'María'),
('ED-024', 'Edificio 24', 'Proyecto C', 3, 'Servicio', '[{"tipo": "Filtro", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 215.1, "cargas_asumidas": "Cargas de servicios urbanos"}'::jsonb, 'Jorge'),
('ED-025', 'Edificio 25', 'Proyecto A', 2, 'Administrativo', '[{"tipo": "Bomba", "cantidad": 3}, {"tipo": "Ventilador", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 178.9, "cargas_asumidas": "Cargas de administración pública"}'::jsonb, 'Ana'),
('ED-026', 'Edificio 26', 'Proyecto B', 1, 'Industrial', '[{"tipo": "Filtro", "cantidad": 3}, {"tipo": "Ventilador", "cantidad": 2}]'::jsonb, '{"capacidad_portante": 280.7, "cargas_asumidas": "Cargas de industria pesada"}'::jsonb, 'Luis'),
('ED-027', 'Edificio 27', 'Proyecto C', 5, 'Residencial', '[{"tipo": "Bomba", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 149.3, "cargas_asumidas": "Cargas residenciales mínimas"}'::jsonb, 'María'),
('ED-028', 'Edificio 28', 'Proyecto A', 3, 'Servicio', '[{"tipo": "Ventilador", "cantidad": 3}, {"tipo": "Filtro", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 225.8, "cargas_asumidas": "Cargas de servicios comunitarios"}'::jsonb, 'Jorge'),
('ED-029', 'Edificio 29', 'Proyecto B', 4, 'Administrativo', '[{"tipo": "Bomba", "cantidad": 2}, {"tipo": "Filtro", "cantidad": 3}]'::jsonb, '{"capacidad_portante": 190.4, "cargas_asumidas": "Cargas de gestión empresarial"}'::jsonb, 'Ana'),
('ED-030', 'Edificio 30', 'Proyecto C', 2, 'Industrial', '[{"tipo": "Ventilador", "cantidad": 1}, {"tipo": "Bomba", "cantidad": 1}, {"tipo": "Filtro", "cantidad": 1}]'::jsonb, '{"capacidad_portante": 260.2, "cargas_asumidas": "Cargas industriales mixtas"}'::jsonb, 'Luis');
